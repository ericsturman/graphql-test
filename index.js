var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
const superagent = require("superagent")

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type CardResult {
    index: String,
    name: String,
    url: String
  }
  type FullCardResult {
    count: Int,
    results: [CardResult]
  }
  type TwoApis {
    cards: FullCardResult,
    features: FullCardResult
  }
  type Query {
    hello: String,
    twoApis: TwoApis
  }
`);

const dndUrl = "https://www.dnd5eapi.co/api/classes"
const dndfeatUrl = "https://www.dnd5eapi.co/api/features"
const magicUrl = "https://api.magicthegathering.io/v1/types"



// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello world!';
  },
  twoApis: async () => {
    const dndData = await superagent.get(dndUrl)

    const dndfeatData = await superagent.get(dndfeatUrl)
    console.log("DND DATA", dndData.body.results)
    return {cards: dndData.body, features: dndfeatData.body}
  }
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
