import { TodoApp } from "./Todo/TodoApp";
import type { FilterType } from "./Todo/types";
import { RouterContext } from "./Todo/routes";

export function App() {
  const router = RouterContext.inject();

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