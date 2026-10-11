import { getAllCategories } from "@/app/actions/category";
import CreateTask from "./create-task";

export default async function TaskBaker() {
  const allCategories = await getAllCategories();

  // biome-ignore lint/style/noNonNullAssertion: It doesn't recieve undefined or null data
  return <CreateTask categories={allCategories!} />;
}
