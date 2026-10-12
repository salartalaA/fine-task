import { getAllCategories } from "@/app/actions/category";
import CreateTask from "./create-task";

export default async function TaskBaker() {
  const allCategories = await getAllCategories();

  const categories = Array.isArray(allCategories) ? allCategories : [];

  return <CreateTask categories={categories} />;
}
