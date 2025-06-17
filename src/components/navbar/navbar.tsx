import { ModeToggle } from "../mode-toggle";

export function Navbar() {
    return (
        <div style={{display: "flex", justifyContent: "flex-end"}}>
            <ModeToggle />
        </div>
    );
}