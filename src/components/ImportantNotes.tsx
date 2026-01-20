import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImportantNotesProps {
    className?: string;
    variant?: "default" | "compact";
}

const ImportantNotes = ({ className, variant = "default" }: ImportantNotesProps) => {
    return (
        <div className={cn(
            "bg-primary/5 rounded-2xl border border-primary/10 transition-all",
            variant === "default" ? "p-4 md:p-5" : "p-3",
            className
        )}>
            <p className={cn(
                "text-primary flex items-center gap-2 mb-2 font-bold",
                variant === "default" ? "text-sm md:text-base" : "text-xs"
            )}>
                <Info className={cn("text-primary", variant === "default" ? "h-4 w-4" : "h-3 w-3")} />
                IMPORTANT NOTES:
            </p>
            <div className={cn(
                "grid grid-cols-1 gap-2 text-primary font-bold",
                variant === "default" ? "md:grid-cols-2 text-xs md:text-sm" : "text-[10px]"
            )}>
                <p className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-primary/40 shrink-0" />
                    One way minimum distance: 130 Kms
                </p>
                <p className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-primary/40 shrink-0" />
                    Round trip minimum distance: 250 Kms
                </p>
                <p className="flex items-center gap-1.5 md:col-span-2">
                    <span className="w-1 h-1 rounded-full bg-primary/40 shrink-0" />
                    Driver allowance: ₹600 per day
                </p>
            </div>
        </div>
    );
};

export default ImportantNotes;
