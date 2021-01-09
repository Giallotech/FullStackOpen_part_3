const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

if (process.argv.length < 3) {
	console.log(
		"Please provide the password as an argument: node mongo.js <password>"
	);
	process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://giallotech:${password}@cluster0.w6pfk.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,
});

const personSchema = mongoose.Schema({
	name: { type: String, minlength: 3, required: true, unique: true },
	number: { type: String, required: true, minlength: 8 },
});

// Apply the uniqueValidator plugin to personSchema.
personSchema.plugin(uniqueValidator);

const Person = mongoose.model("Person", personSchema);

const person = new Person({
	name: process.argv[3],
	number: process.argv[4],
});
if (process.argv.length > 3) {
	person.save().then((result) => {
		console.log(
			`added ${process.argv[3]} number ${process.argv[4]} to phonebook`
		);
		mongoose.connection.close();
	});
}

if (process.argv.length === 3) {
	Person.find({}).then((result) => {
		result.forEach((person) => {
			console.log(person);
		});
		mongoose.connection.close();
	});
}
