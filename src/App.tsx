import { useRouter, useInjectContext, useEffect } from "rask-ui";
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
        {renderRoutes()}
      </div>
    </div>
  );

  function renderRoutes() {
    if (router.route?.name == "todos") {
      const filter = router.route.params.filter as FilterType;
      return <TodoApp filter={filter} />;
    }
    return <TodoApp />;
  }
}