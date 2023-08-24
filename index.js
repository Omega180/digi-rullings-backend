const express = require("express")
const PORT = process.env.PORT || 3001
const app = express()

const cors = require("cors")
const bodyParser = require("body-parser")
const mysql = require("mysql2")
const db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "digi_rullings",
})
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))

/* Solicitudes Get */

app.get("/", (req, res) => {
	res.send("Server online")
})

app.get("/api", (req, res) => {
	res.send("Hello from the Api")
})

app.get("/api/getKeyword/:name", (req, res) => {
	const name = req.params.name
	const resultado = `Select keyword_id, keyword_nombre, keyword_explanation from keyword where keyword_nombre = ?`
	db.query(resultado, [name], (err, result) => {
		if (err) throw err
		res.send(result)
	})
})

app.get("/api/keywordList/getEnglish", (req, res) => {
	const sqlSelect =
		"Select keyword_id, keyword_nombre, keyword_explanation from keyword"
	db.query(sqlSelect, (err, result) => {
		if (err) throw err
		res.send(result)
	})
})
app.get("/api/keywordList/getSpanish", (req, res) => {
	const sqlSelect =
		"Select keyword_id, keyword_nombre, keyword_explanation_spanish from keyword"
	db.query(sqlSelect, (err, result) => {
		if (err) throw err
		res.send(result)
	})
})

app.get("/api/getRullings/English", (req, res) => {
	const keywordSeleccionada = req.query.keywordSeleccionada
	const sqlSelect = `select kw.keyword_nombre as 'keyword_name', kw.keyword_explanation as 'keyword_explanation_english', r.question, r.answer from rullings as r inner join keyword as kw on r.keyword_id = kw.keyword_id inner join rulling_language as rl on r.language_id = rl.rl_id where kw.keyword_id = ? and r.official_or_not = 'Yes' and rl.rl_id = 1`
	db.query(sqlSelect, [keywordSeleccionada], (err, result) => {
		if (err) throw err
		res.send(result)
	})
})
app.get("/api/getRullings/Spanish", (req, res) => {
	const keywordSeleccionada = req.query.keywordSeleccionada
	const sqlSelect = `select kw.keyword_nombre as 'keyword_name', kw.keyword_explanation as 'keyword_explanation_english', r.question, r.answer from rullings as r inner join keyword as kw on r.keyword_id = kw.keyword_id inner join rulling_language as rl on r.language_id = rl.rl_id where kw.keyword_id = ? and r.official_or_not = 'Yes' and rl.rl_id = 2`
	db.query(sqlSelect, [keywordSeleccionada], (err, result) => {
		if (err) throw err
		res.send(result)
	})
})

/* Solicitudes POST */

app.post("/api/sendRulling", (req, res) => {
	const keyword = req.body.keyword
	const lenguaje = req.body.lenguaje
	const oficial = req.body.oficial
	const pregunta = req.body.pregunta
	const respuesta = req.body.respuesta
	const sqlInsert =
		"Insert into rullings(`question`, `answer`, `official_or_not`, `keyword_id`, `language_id`) VALUES (?,?,?,?,?)"
	db.query(
		sqlInsert,
		[pregunta, respuesta, oficial, keyword, lenguaje],
		(err, result) => {
			if (err) throw err
			console.log(err)
			console.log(result)
		}
	)
})

app.listen(PORT, () => {
	console.log(`The Server is listening in the port ${PORT}`)
})
