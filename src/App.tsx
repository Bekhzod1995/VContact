import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import List from "./components/user";
import UserCreate from "./components/user/create";
import UserUpdate from "./components/user/update";

const router = createBrowserRouter([
  {
    path: "/",
    element: <List />,
    errorElement: <h1>Not found</h1>,
  },
  {
    path: "create",
    element: <UserCreate />,
  },
  {
    path: "user/:userId",
    element: <UserUpdate />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
