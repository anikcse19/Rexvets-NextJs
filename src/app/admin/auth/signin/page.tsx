import { redirect } from "next/navigation";

const page = () => {
  // Redirect to central signin page
  redirect("/auth/signin");
};

export default page;
