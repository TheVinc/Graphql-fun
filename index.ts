import { graphql, buildSchema } from "graphql";
import { readFileSync } from "fs";
import { makeExecutableSchema } from "@graphql-tools/schema";

async function main() {
  // Read String from File (DSL = GraphQL schema language)
  const rawSchema = readFileSync("./schema.graphql", "utf-8");

  const filename = process.argv[2];
  const source = readFileSync(filename, "utf-8");

  // https://graphql.org/learn/execution/#root-fields-resolvers
  const overrideResolvers = {
    Query: {
      customer: (_, args) => {
        console.log("Query::customer");

        // Obj Type of Customer:
        // Store.Customer
        return {
          legacyId: "1234",
          name: "John Doe",
          restaurantId: "5678",
        };
      },
    },

    // What is the Obj Type of Restaurant?
    // Store.Restaurant
    // Restaurant: {

    // },


    // What VirtualMode does:
    // Role of Resolver:
    // InternalType --> SchemaType
    // Maps Internal Types to Schema Type
    // Example Internal Type comes from the Database


    // What is the Obj Type of Customer?
    // Store.Customer
    Customer: {
      id: (_) => {
        console.log("Customer::id");
        console.log(_);
        return _.id;
      },
      name: (_) => {
        console.log("Customer::name");
        console.log(_);
        return _.name;
      },
      // restaurant: (_, args, { dataloaders }) => {
      //   return dataloaders.Restaurant.load(_.restaurantId);
      // }
    },
  };

  // Construct a schema: String -> Schema Internal Representation
  const executableSchema = makeExecutableSchema({
    typeDefs: rawSchema,
    resolvers: overrideResolvers,
  });

  const response = await graphql({ schema: executableSchema, source });
  // npx ts-node index.ts queries/introspection.gql
  // console.log(
  //   JSON.stringify(
  //     // @ts-expect-error
  //     response.data?.__schema.types.filter((_type) => {
  //       return !_type.name.startsWith("__");
  //     }),
  //     null,
  //     2
  //   )
  // );
}

// npx ts-node -T index.ts queries/query.gql
main();