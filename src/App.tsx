import { useRouter, useInjectContext } from "rask-ui";
import { TodoApp } from "./Todo/TodoApp";
import type { FilterType } from "./Todo/types";
import { RouterContext, routes } from "./Todo/routes";

export function App() {
  const router = useRouter(routes);
  const inject = useInjectContext(RouterContext);

  inject(router);

  return () => (
    <div className="app-container">
      <div className="card">
        {router.route?.name == "home" && <TodoApp />}
        {router.route?.name == "todos" && <TodoApp filter={router.route.params.filter as FilterType} />}
      </div>
    </div>
  );
}