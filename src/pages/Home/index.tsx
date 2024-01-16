import { useContext } from "react";
import { HandPalm, Play } from "phosphor-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
	HomeContainer,
	StartCountdownButton,
	StopCountdownButton,
} from "./styles";

import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";
import { CyclesContext } from "@/contexts/CyclesContext";

const newCycleFormValidationSchema = z.object({
	task: z.string().min(1, "Informe a tarefa"),
	minutesAmount: z
		.number()
		.min(1, "O ciclo precisa ser de no mínimo 5 minutos.")
		.max(60, "O ciclo precisa ser de no máximo 60 minutos."),
});

type NewCycleFormData = z.infer<typeof newCycleFormValidationSchema>;

export function Home() {
	const { createNewCycle, interruptCurrentCycle, activeCycle } =
		useContext(CyclesContext);

	const newCycleForm = useForm<NewCycleFormData>({
		resolver: zodResolver(newCycleFormValidationSchema),
		defaultValues: {
			task: "",
			minutesAmount: 0,
		},
	});

	const { handleSubmit, watch /* reset */ } = newCycleForm;

	const task = watch("task");
	const isSubmitDisabled = !task;

	/**
	 * Prop Drilling -> Quando a gente tem MUITAS propriedades APENAS para comunicação entre componentes
	 */

	return (
		<HomeContainer>
			<form onSubmit={handleSubmit(createNewCycle)}>
				<FormProvider {...newCycleForm}>
					<NewCycleForm />
				</FormProvider>
				<Countdown />

				{activeCycle ? (
					<StopCountdownButton
						onClick={interruptCurrentCycle}
						type="button"
					>
						<HandPalm size={24} />
						Interromper
					</StopCountdownButton>
				) : (
					<StartCountdownButton
						disabled={isSubmitDisabled}
						type="submit"
					>
						<Play size={24} />
						Começar
					</StartCountdownButton>
				)}
			</form>
		</HomeContainer>
	);
}
