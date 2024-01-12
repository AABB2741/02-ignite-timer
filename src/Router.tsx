import { Route, Routes } from "react-router-dom";

import { DefaultLayout } from "./layouts/DefaultLayout";

import { Home } from "./pages/Home";
import { History } from "./pages/History";

export function Router() {
	return (
		<Routes>
			<Route path="/" Component={DefaultLayout}>
				<Route path="/" Component={Home} />
				<Route path="/history" Component={History} />
			</Route>
		</Routes>
	);
}
