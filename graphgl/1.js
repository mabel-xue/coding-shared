var { graphql, buildSchema } = require('graphql');

var schema = buildSchema(`
{
  hero {
    name
    # Queries can have comments!
    friends {
      name
    }
  }
}
`);

var root = {  };

graphql(schema, '{ data }').then((response) => {
  console.log(response);
});