import { graphql, buildSchema } from "graphql";
import { readFileSync } from "fs";

async function main() {
  // Read String from File (DSL = GraphQL schema language)
  const rawSchema = readFileSync("./schema.graphql", "utf-8");

  // Construct a schema: String -> Schema Internal Representation
  const schema = buildSchema(rawSchema);

  const filename = process.argv[2];
  const source = readFileSync(filename, "utf-8");
  const rootValue = {};

  const response = await graphql({ schema, source, rootValue });
  console.log(
    JSON.stringify(
      // @ts-expect-error
      response.data?.__schema.types.filter((_type) => {
        return !_type.name.startsWith("__");
      }),
      null,
      2
    )
  );
}

main();
// npx ts-node index.ts queries/introspection.gql
