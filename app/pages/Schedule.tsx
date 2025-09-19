import { redirect } from "react-router";
import { ScheduleForm } from "~/components/schedule-form";
import { useAuth } from "~/context/AuthContext";

export async function loader() {

  const res = await fetch("/api/v1/refresh", {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    throw redirect("/");
  }
  return null;
}

export default function SchedulePage() {
  const auth = useAuth();
  return (
    <div>TOKEN: {auth.token}</div>
  )
}

// export default function SchedulePage() {
//   return (
//     // <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
//     //   <div className="w-full max-w-sm md:max-w-3xl">
//     <ScheduleForm />
//     //   </div>
//     // </div>
//   );
// }
