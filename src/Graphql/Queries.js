import { gql } from "@apollo/client";

export const LOAD_CLASSROOMS = gql`
    query {
        classrooms{
            id,
            name,
            year,
        }
    }
`
export const GET_CLASSROOM_BY_ID = gql`
    query($id: ID!) 
        {
        classroom(id: $id){
            id,
            name,
            year
        }
    }
    `
export const GET_ALL_TEACHERS = gql`
    query {
        Teachers{
            id,
            name,
            address,
            phone_number,
            user{
                id,
                email
            },
            classrooms{
            id,
            name,
            year
            }
        }
    }
    `
export const GET_TEACHER_BY_ID = gql`
    query($id: ID!) 
        {
        Teacher(id: $id){
            id,
            name,
            address,
            phone_number,
            classrooms{
            id,
            name,
            year
            }
        }
    }`
export const GET_ALL_STUDENTS = gql`
    query {
        Students{
            id,
            name,
            address,
            phone_number,
            date_of_birth,
            classrooms{
            id,
            name,
            year
            }
            user{
                id,
                email
            }
        }
    }
    `
export const GET_STUDENT_BY_ID = gql`
    query($id: ID!) 
        {
        Student(id: $id){
            id,
            name,
            address,
            phone_number,
            date_of_birth,,
            classrooms{
            id,
            name,
            year
            }
            user{
                id,
                email
            }
        }
    }`