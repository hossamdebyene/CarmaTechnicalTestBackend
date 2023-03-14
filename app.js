const express = require("express");
const bodyParser = require("body-parser");
const Joi = require("joi");
const cors = require("cors");

const cardValidationSchema = Joi.object({
  cardCVV: Joi.string().required().messages({
    "any.required": "cardCvv is required",
  }),
  cardHolderName: Joi.string().required().messages({
    "any.required": "cardHolderName is required",
  }),
  cardPanNumber: Joi.string().required().messages({
    "any.required": "card number is required",
  }),
  cardExpiryDate: Joi.string().required().messages({
    "any.required": "card expiryDate is required",
  }),
});

require("dotenv").config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 6000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const db = require("./queries");

db.createDatabaseAndTable();

const validateRequestBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => ({ message: err.message }));
      req.validationErrors = errors;
      next();
    } else {
      next();
    }
  };
};

app.get("/cards", db.getCards);
app.get("/card/:id", db.getCardById);
app.post(
  "/create-card",
  validateRequestBody(cardValidationSchema),
  (req, res) => {
    if (req.validationErrors && req.validationErrors.length > 0) {
      return res.status(400).json({ errors: req.validationErrors });
    }
    db.createCard(req, res);
  }
);

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
