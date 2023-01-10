# GraphQL Basics Introduction

Virtual Mode requires you to have some base knowledge on GraphQL, and the official library GraphQLJS:
https://graphql.org/graphql-js/

The goal will be to introduce the library, how resolvers work, outside of a server.

## Introspection

Introspection in done at two levels

```mermaid
graph BT

  FetchSchemaFromPreproduction

  subgraph Preproduction
    TFM-API
  end


  subgraph LocalDevelopment
    LocalSchema("schema.graphql")
    IntrospectionFile("introspection.json")
    GraphQLCodegen  --reads--> LocalSchema 
  end

  FetchSchemaFromPreproduction --IntrospectionQuery --> TFM-API
  FetchSchemaFromPreproduction --ConvertToGraphQL --> LocalSchema

  GraphQLCodegen --ConvertToIntrospection--> IntrospectionFile
```


```mermaid
graph LR
  TFMAPI --> IntrospectionQuery --> SchemaGraphql --> IntrospectionJSON
```



![Screenshot 2023-01-10 at 18 25 14](https://user-images.githubusercontent.com/2675574/211620291-b760a6d1-9bd0-4ff3-958f-35fba5f4f6e1.png)
