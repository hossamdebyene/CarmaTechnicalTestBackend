const cryptoMethods = require("./utils/cryptoservices");
const luhn = require("luhn");
const Pool = require("pg").Pool;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});
const publicKey = process.env.PUBLIC_KEY;
const privateKey = process.env.PRIVATE_KEY;

const tableQuery = `
    CREATE TABLE IF NOT EXISTS "cardinfodata" (
	    id SERIAL,
	    cardholderName VARCHAR(500) NOT NULL,
	    cardpanNumber VARCHAR(500) NOT NULL,
	    cardcvv VARCHAR(500) NOT NULL,
	    cardexpiredate VARCHAR(5) NOT NULL,
	    PRIMARY KEY (id)
    );`;

const createDatabaseAndTable = async () => {
  try {
    await pool.connect();
    await pool.query(tableQuery);
    return console.log("Table Created");
  } catch (error) {
    console.error(error.stack);
    return console.error(error.stack);
  }
};

const getCards = (request, response) => {
  pool.query("SELECT * FROM cardinfodata ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getCardById = async (request, response) => {
  await pool.connect();
  const id = request.params.id;
  pool.query(
    "SELECT * FROM cardinfodata WHERE id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      const encryptedCardPanNumberDecrypted = cryptoMethods.decryptMessage(
        results?.rows[0].cardpannumber,
        privateKey
      );
      const encryptedCVVDecrypted = cryptoMethods.decryptMessage(
        results?.rows[0].cardcvv,
        privateKey
      );
      results.rows[0].cardcvv = encryptedCVVDecrypted;
      results.rows[0].cardpannumber = encryptedCardPanNumberDecrypted;
      response.status(200).json(results.rows);
    }
  );
};

const createCard = async (request, response) => {
  const { cardHolderName, cardCVV, cardPanNumber, cardExpiryDate } =
    request.body;
  const isValid = luhn.validate(cardPanNumber);
  if (isValid) {
    await pool.connect();
    const cardPanNumberEncrypted = cryptoMethods.encryptMessage(
      cardPanNumber,
      publicKey
    );
    const encryptedCVVEncrypted = cryptoMethods.encryptMessage(
      cardCVV,
      publicKey
    );

    pool.query(
      `INSERT INTO cardinfodata (
                cardholdername,
                cardcvv,
                cardpannumber,
                cardexpiredate
            ) VALUES ($1, $2, $3, $4)`,
      [
        cardHolderName,
        encryptedCVVEncrypted,
        cardPanNumberEncrypted,
        cardExpiryDate,
      ],
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(201).send({ sucess: true });
      }
    );
  } else {
    response.status(500).send("invalid card");
  }
};

module.exports = {
  getCards,
  getCardById,
  createCard,
  createDatabaseAndTable,
};
