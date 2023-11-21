import { MuiButton } from "@/components/ui";
import { useStore } from "@/hooks";

export default function Home() {
  const { state, dispatch } = useStore()

  const onToggleThemeHandler = (_: React.MouseEvent<HTMLButtonElement>) => {
    dispatch({ type: "TOGGLE_THEME" })
  }

  return (
    <div>
      <MuiButton onClick={onToggleThemeHandler}>{state.theme}</MuiButton>
    </div>
  )
}
