export function BacklogTodos({ todos, user }) {
  console.log("Loaded todos in Component:", todos);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📥 Backlog</h1>
        <p className="text-gray-600">Tasks without specific due dates</p>
      </div>

      {/* <div className="card p-6">
          {todos.rows.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">📝</div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                No tasks in backlog
              </h3>
              <p className="text-sm text-gray-500">
                Create your first task to get started
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {todos.rows.map((todo) => (
                <div
                  key={todo.$id}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <h4 className="font-medium">{todo.title}</h4>
                  {todo.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {todo.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div> */}
    </div>
  );
}
