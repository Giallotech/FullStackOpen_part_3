const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("build"));

morgan.token("data", (request) => JSON.stringify(request.body));

app.use(
	morgan(
		":method :url :status :res[content-length] - :response-time ms :data"
	)
);

let persons = [
	{
		id: 1,
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: 2,
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: 3,
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: 4,
		name: "Mary Poppendick",
		number: "39-23-6423122",
	},
];

const generateId = (min, max) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min);
};

app.post("/api/persons", (request, response) => {
	const body = request.body;
	const exists = persons.find((item) => item.name === body.name);

	if (exists) {
		return response.status(400).json({
			error: "name must be unique",
		});
	}

	if (!body.name || !body.number) {
		return response.status(400).json({
			error: "either name or number missing",
		});
	}

	const person = {
		name: body.name,
		number: body.number,
		id: generateId(1, 1000),
	};
	persons = persons.concat(person);
	response.json(person);
});

app.get("/api/persons/:id", (request, response) => {
	const id = Number(request.params.id);
	const person = persons.find((item) => item.id === id);

	if (person) {
		response.json(person);
	} else {
		response.status(404).end();
	}
});

app.delete("/api/persons/:id", (request, response) => {
	const id = Number(request.params.id);
	persons = persons.filter((item) => item.id !== id);
	response.status(204).end();
});

app.get("/info", (request, response) => {
	response.send(`Phonebook has info for ${persons.length} people </br></br>
    ${new Date()}`);
});

app.get("/api/persons", (request, response) => {
	response.json(persons);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`server running on port ${PORT}`);
});
