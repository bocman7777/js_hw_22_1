$(document).ready(function () {
    const taskInput = $("#taskInput");
    const taskList = $("#taskList");

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(t => addTaskToList(t.text, t.done));
    }

    function saveTasks() {
        const tasks = [];
        taskList.children().each(function () {
            tasks.push({
                text: $(this).find(".task-text").text(),
                done: $(this).find(".form-check-input").prop("checked")
            });
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function addTaskToList(text, done = false) {
        const li = $(`
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <div class="form-check">
          <input class="form-check-input me-2" type="checkbox">
          <span class="task-text" role="button">${text}</span>
        </div>
        <button class="btn btn-sm btn-danger">×</button>
      </li>
    `);

        li.find(".form-check-input").prop("checked", done);

        li.find(".task-text").on("click", function () {
            $("#modalBody").text($(this).text());
            const modal = new bootstrap.Modal($("#taskModal"));
            modal.show();
        });

        li.find(".btn-danger").on("click", function () {
            li.remove();
            saveTasks();
        });

        li.find(".form-check-input").on("change", saveTasks);

        taskList.append(li);
        saveTasks();
    }

    $("#addTask").on("click", function () {
        const text = taskInput.val().trim();
        if (text) {
            addTaskToList(text);
            taskInput.val("");
        }
    });

    taskInput.on("keypress", function (e) {
        if (e.which === 13) {
            $("#addTask").click();
        }
    });

    loadTasks();
});
