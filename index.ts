import { graphql } from "graphql";
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
      customer: () => {
        console.log("Query::customer");

        // Obj Type of Customer:
        // Store.Customer
        return {
          legacyId: "1234",
          name: "John Doe",
          restaurantId: "5678",
        };
      },
      restaurant: (parent, args, context) => {
        // fetch from database / dataloaders
        console.log("args", args);
        // solution1: flag explicitly === branded type
        // return { __typename: "NewRestaurant" };
        return {
          id: "1234",
          name: "John Doe",
          legacyId: "5678",
        };
      },
    },
    Customer: {
      id: (_: { id: any }) => {
        console.log("Customer::id");
        console.log(_);
        return _.id;
      },
      name: (_: { name: any }) => {
        console.log("Customer::name");
        console.log(_);
        return _.name;
      },
    },

    Restaurant: {
      // __resolveType: (obj) => {
      //   // solution 2: 
      //   console.log("Restaurant obj", obj);
      //   return undefined;
      //   return 'NewRestaurant';
      //   return 'OldRestaurant';
      // },
    },
    NewRestaurant: {
      id: () => "new123",
      name: () => "Some new restaurant",
      __isTypeOf: (obj) => {
        console.log("NewRestaurant obj", obj);
        return !obj.legacyId;
      },
    },

    OldRestaurant: {
      id: () => "old123",
      name: () => "Some Old Restaurant",
      __isTypeOf: (obj) => {
        console.log("OldRestaurant obj", obj);
        return obj.legacyId;
      },
    },
  };

  // Construct a schema: String -> Schema Internal Representation
  const executableSchema = makeExecutableSchema({
    typeDefs: rawSchema,
    resolvers: overrideResolvers,
  });

  const response = await graphql({ schema: executableSchema, source });
  console.log("response", response);
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
