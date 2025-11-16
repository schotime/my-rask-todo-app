import { BrowserRouter, Route, Switch } from "inferno-router";
import { TodoApp } from "./Todo/TodoApp";

export function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <div className="card">
          <Switch>
            <Route path="/todos/:filter?" component={TodoApp} />
            <Route path="/" component={TodoApp} />
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
}
