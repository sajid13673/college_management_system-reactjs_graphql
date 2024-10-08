import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password, device_name: "web") {
      token
      role
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation {
    logout
  }
`;

export const DELETE_CLASSROOM = gql`
  mutation deleteClassroom($id: ID!) {
    deleteClassroom(id: $id) {
      name
    }
  }
`;

export const CREATE_CLASSROOM_MUTATION = gql`
  mutation createClassroom($name: String!, $year: String!) {
    createClassroom(input: { name: $name, year: $year }) {
      name
    }
  }
`;
export const UPDATE_CLASSROOM_MUTATION = gql`
    mutation updateClassroom($id: ID!, $name: String!, $year: String!)
    {
        updateClassroom(input:{id: $id, name: $name, year: $year}){
            name
        }
    }`;
export const CREATE_TEACHER_MUTATION = gql`
  mutation createTeacher(
    $email: String!
    $password: String!
    $name: String!
    $address: String!
    $phone_number: String!
    $classrooms: [ID!]
  ) {
    createTeacher(
      input: {
        name: $name
        address: $address
        phone_number: $phone_number
        user: {
          create: { email: $email, password: $password, role: "teacher" }
        }
        classrooms: { connect: $classrooms }
      }
    ) {
      name
    }
  }
`;
export const UPDATE_TEACHER_MUTATION = gql`
  mutation updateTeacher(
    $id: ID!
    $name: String!
    $address: String!
    $phone_number: String!
    $classrooms: [ID!]
  ) {
    updateTeacher(
      input: {
        id: $id
        name: $name
        address: $address
        phone_number: $phone_number
        classrooms: { sync: $classrooms }
      }
    ) {
      name
      email
    }
  }
`;
export const DELETE_TEACHER = gql`
  mutation deleteTeacher($id: ID!) {
    deleteTeacher(id: $id) {
      name
    }
  }
`;
export const CREATE_STUDENT_MUTATION = gql`
  mutation createStudent(
    $email: String!
    $password: String!
    $name: String!
    $address: String!
    $phone_number: String!
    $classrooms: [ID!]
    $date_of_birth: String!
  ) {
    createStudent(
      input: {
        name: $name
        address: $address
        phone_number: $phone_number
        date_of_birth: $date_of_birth
        user: { create: { email: $email, password: $password } }
        classrooms: { connect: $classrooms }
      }
    ) {
      name
    }
  }
`;
export const UPDATE_STUDENT_MUTATION = gql`
  mutation updateStudent(
    $id: ID!
    $name: String!
    $address: String!
    $phone_number: String!
    $classrooms: [ID!]
    $date_of_birth: String!
  ) {
    updateStudent(
      input: {
        id: $id
        name: $name
        address: $address
        phone_number: $phone_number
        classrooms: { sync: $classrooms }
        date_of_birth: $date_of_birth
      }
    ) {
      name
      email
    }
  }
`;
export const DELETE_STUDENT = gql`
  mutation deleteStudent($id: ID!) {
    deleteStudent(id: $id) {
      name
    }
  }
`;
export const DELETE_USER = gql`
  mutation deleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;
export const CREATE_CLASS_MATERIAL = gql`
  mutation createClassMaterial($file: Upload!, $name: String!, $description: String, $classroom_id: ID!) {
    createClassMaterial(file:$file, name: $name, description:$description, classroom_id: $classroom_id) {
      name
      description
    }
  }
`
export const DELETE_CLASS_MATERIAL = gql`
  mutation deleteClassMaterial($id: ID!) {
    deleteClassMaterial(id: $id) {
      id
      name
    }
  }
`
export const CREATE_CLASS_NOTE = gql`
  mutation createClassNote($title: String!, $description: String!, $classroom_id: ID!) {
    createClassNote(title: $title, description:$description, classroom_id: $classroom_id) {
      title
      description
    }
  }
`
export const DELETE_CLASS_NOTE = gql`
  mutation deleteClassNote($id: ID!) {
    deleteClassNote(id: $id) {
      id
      title
    }
  }
`
