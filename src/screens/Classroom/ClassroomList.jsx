import React from "react";
import AdminClassroomList from "../../components/Classroom/adminClassroomList";
import { useAuth } from "../../utils/authProvider";
import UserClassroomList from "../../components/Classroom/UserClassroomList";

function ClassroomList({ StyledHeadTableCell, ErrorMessage, modalBoxstyle, user }) {
  const {token} = useAuth()
  console.log(token);
  return (
    <>
    {token.role === "admin" ? (
    <AdminClassroomList
      styledHeadTableCell={StyledHeadTableCell}
      ErrorMessage={ErrorMessage}
      modalBoxstyle={modalBoxstyle}
    />) : (
      <UserClassroomList
      user = {user}
      />
    )}
    </>
  );
}

export default ClassroomList;
