# Simple GraphQL test server

## To run locally run

```bash
$ npm i && npm start
```

JSON-server running at

```bash
http://localhost:3000/
```

GraphiQL running at

```bash
http://localhost:4000/graphql
```

## Some GraphQL queries to test

```graphql
{
  employees {
    name
    email
  }
}
```

```graphql
{
  company(id: "2") {
    name
    description
  }
}
```

```graphql
{
  employee(id: "2") {
    name
    email
    age
    company {
      name
    }
  }
}
```

```graphql
mutation {
  addEmployee(name: "Joe Jackson", email: "joe@gmail.com", age: 34) {
    id
    name
    email
  }
}
```

```graphql
mutation {
  deleteEmployee(id: "9D89cB2") {
    id
  }
}
```

```graphql
mutation {
  editEmployee(id: "2", name: "Steve Jhonson", age: 50) {
    id
    name
  }
}
```
