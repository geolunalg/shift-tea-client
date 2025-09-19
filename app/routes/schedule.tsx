// import ScheduleForm from "~/pages/Schedule";
import { redirect } from "react-router";
import SchedulePage from "~/pages/Schedule";
import { useAuth } from "~/context/AuthContext";





export default function Schedule() {
  return <SchedulePage />;
}
