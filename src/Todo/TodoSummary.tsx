export function TodoSummary(props: { total: number; active: number; completed: number; onClearCompleted: () => void; }) {
    if (props.total === 0)
        return null;

    return (
        <footer class="mt-6 pt-6 border-t border-gray-200">
            <div class="flex justify-between items-center text-sm text-gray-500">
                <span>
                    {props.active === 0
                        ? "All tasks completed! 🎉"
                        : `${props.active} ${props.active === 1 ? "task" : "tasks"} remaining`}
                </span>
                {props.completed > 0 && (
                    <button
                        onClick={() => {
                            props.onClearCompleted();
                        }}
                        class="text-red-500 hover:text-red-700 transition-colors"
                    >
                        Clear completed
                    </button>
                )}
            </div>
        </footer>
    );
}
