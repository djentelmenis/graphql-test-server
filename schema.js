const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList, GraphQLNonNull } = require('graphql');
const axios = require('axios');
const PORT = 3000;
const EMPLOYEES = 'employees';
const COMPANIES = 'companies';

// Helper functions
const getCompany = (args) => axios.get(`http://localhost:${PORT}/${COMPANIES}/${args.id}`).then((res) => res.data);
const getCompanies = () => axios.get(`http://localhost:${PORT}/${COMPANIES}`).then((res) => res.data);
const getEmployee = (args) => axios.get(`http://localhost:${PORT}/${EMPLOYEES}/${args.id}`).then((res) => res.data);
const getEmployees = () => axios.get(`http://localhost:${PORT}/${EMPLOYEES}`).then((res) => res.data);
const deleteEmployee = (args) =>
  axios.delete(`http://localhost:${PORT}/${EMPLOYEES}/${args.id}`).then((res) => res.data);
const patchEmployee = (args) =>
  axios.patch(`http://localhost:${PORT}/${EMPLOYEES}/${args.id}`, args).then((res) => res.data);

// Company Type
const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
  }),
});

// Employee Type
const EmployeeType = new GraphQLObjectType({
  name: 'Employee',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: { type: CompanyType },
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    employee: {
      type: EmployeeType,
      args: {
        id: { type: GraphQLString },
      },
      async resolve(parentValue, args) {
        const employee = await getEmployee(args);
        const companies = await getCompanies();
        return { ...employee, company: companies.find((company) => company.id === employee.company) };
      },
    },
    employees: {
      type: new GraphQLList(EmployeeType),
      async resolve() {
        const employees = await getEmployees();
        const companies = await getCompanies();
        return employees.map((employee) => ({
          ...employee,
          company: companies.find((company) => company.id === employee.company),
        }));
      },
    },
    company: {
      type: CompanyType,
      args: {
        id: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        return getCompany(args);
      },
    },
    companies: {
      type: new GraphQLList(CompanyType),
      resolve() {
        return getCompanies();
      },
    },
  },
});

// Mutations
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addEmployee: {
      type: EmployeeType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parentValue, args) {
        return axios
          .post(`http://localhost:${PORT}/employees`, {
            name: args.name,
            email: args.email,
            age: args.age,
          })
          .then((res) => res.data);
      },
    },
    deleteEmployee: {
      type: EmployeeType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, args) {
        return deleteEmployee(args);
      },
    },
    editEmployee: {
      type: EmployeeType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve(parentValue, args) {
        return patchEmployee(args);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
