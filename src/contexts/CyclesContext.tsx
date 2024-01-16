import { createContext, useState, useReducer } from "react";

interface CreateCycleData {
	task: string;
	minutesAmount: number;
}

interface Cycle {
	id: string;
	task: string;
	minutesAmount: number;
	startDate: Date;
	interruptedDate?: Date;
	finishedDate?: Date;
}

interface CyclesContextType {
	cycles: Cycle[];
	activeCycle?: Cycle;
	activeCycleId: string | null;
	amountSecondsPassed: number;
	markCurrentCycleAsFinished: () => void;
	setSecondsPassed: (seconds: number) => void;
	createNewCycle: (data: CreateCycleData) => void;
	interruptCurrentCycle: () => void;
}

interface CyclesContextProviderProps {
	children: React.ReactNode;
}

export const CyclesContext = createContext({} as CyclesContextType);

export function CyclesContextProvider({
	children,
}: CyclesContextProviderProps) {
	// eslint-disable-next-line
	const [cycles, dispatch] = useReducer((state: Cycle[], action: any) => {
		if (action.type === "ADD_NEW_CYCLE") {
			return [...state, action.payload.newCycle];
		}

		return state;
	}, []);

	const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
	const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

	const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

	function setSecondsPassed(seconds: number) {
		setAmountSecondsPassed(seconds);
	}

	function markCurrentCycleAsFinished() {
		// setCycles((state) =>
		// 	state.map((c) => {
		// 		if (c.id === activeCycleId) {
		// 			return { ...c, finishedDate: new Date() };
		// 		} else {
		// 			return c;
		// 		}
		// 	})
		// );

		dispatch({
			type: "MARK_CURRENT_CYCLE_AS_FINISHED",
			payload: { activeCycleId },
		});
	}

	function createNewCycle(data: CreateCycleData) {
		const id = String(new Date().getTime());
		const newCycle: Cycle = {
			id,
			task: data.task,
			minutesAmount: data.minutesAmount,
			startDate: new Date(),
		};

		dispatch({
			type: "ADD_NEW_CYCLE",
			payload: { newCycle },
		});

		// setCycles((state) => [...state, newCycle]);
		setActiveCycleId(id);
		setAmountSecondsPassed(0);
	}

	function interruptCurrentCycle() {
		// setCycles((state) =>
		// 	state.map((c) => {
		// 		if (c.id === activeCycleId) {
		// 			return { ...c, interruptedDate: new Date() };
		// 		} else {
		// 			return c;
		// 		}
		// 	})
		// );

		dispatch({
			type: "INTERRUPT_CURRENT_CYCLE",
			payload: {
				activeCycleId,
			},
		});

		setActiveCycleId(null);
	}

	return (
		<CyclesContext.Provider
			value={{
				cycles,
				activeCycle,
				activeCycleId,
				amountSecondsPassed,
				markCurrentCycleAsFinished,
				setSecondsPassed,
				createNewCycle,
				interruptCurrentCycle,
			}}
		>
			{children}
		</CyclesContext.Provider>
	);
}
