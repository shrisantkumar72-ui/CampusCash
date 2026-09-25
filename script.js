const addExpenseBtn =
    document.getElementById("addExpenseBtn");

const expenseModal =
    document.getElementById("expenseModal");

const closeModal =
    document.getElementById("closeModal");

const saveExpense =
    document.getElementById("saveExpense");

const amountInput =
    document.getElementById("amountInput");

const typeInput =
    document.getElementById("typeInput");

const categoryInput =
    document.getElementById("categoryInput");

const descriptionInput =
    document.getElementById("descriptionInput");

const dateInput =
    document.getElementById("dateInput");

const transactionList =
    document.getElementById("transactionList");

const balance =
    document.getElementById("balance");

const income =
    document.getElementById("income");

const expense =
    document.getElementById("expense");

const budgetSpent =
    document.getElementById("budgetSpent");

const progressBar =
    document.getElementById("progressBar");


const MONTHLY_BUDGET = 10000;


/* LOAD SAVED DATA */

let transactions =
    JSON.parse(
        localStorage.getItem("campusCashTransactions")
    ) || [];


/* OPEN MODAL */

addExpenseBtn.addEventListener(
    "click",
    function () {

        expenseModal.classList.add("active");

        lucide.createIcons();

    }
);


/* CLOSE MODAL */

closeModal.addEventListener(
    "click",
    function () {

        expenseModal.classList.remove("active");

    }
);


/* CLOSE WHEN CLICKING OUTSIDE */

expenseModal.addEventListener(
    "click",
    function (event) {

        if (event.target === expenseModal) {

            expenseModal.classList.remove("active");

        }

    }
);


/* SAVE TRANSACTION */

saveExpense.addEventListener(
    "click",
    function () {

        const amount =
            Number(amountInput.value);

        const type =
            typeInput.value;

        const category =
            categoryInput.value;

        const description =
            descriptionInput.value.trim();

        const date =
            dateInput.value;


        if (
            amount <= 0 ||
            category === "" ||
            description === ""
        ) {

            alert(
                "Please fill all the details."
            );

            return;
        }


        const transaction = {

            id: Date.now(),

            amount: amount,

            type: type,

            category: category,

            description: description,

            date:
                date ||
                new Date()
                    .toISOString()
                    .split("T")[0]

        };


        transactions.unshift(
            transaction
        );


        saveData();

        updateDashboard();

        clearForm();

        expenseModal.classList.remove(
            "active"
        );

    }
);


/* SAVE TO LOCAL STORAGE */

function saveData() {

    localStorage.setItem(
        "campusCashTransactions",
        JSON.stringify(transactions)
    );

}


/* CLEAR FORM */

function clearForm() {

    amountInput.value = "";

    typeInput.value = "expense";

    categoryInput.value = "";

    descriptionInput.value = "";

    dateInput.value = "";

}


/* UPDATE DASHBOARD */

function updateDashboard() {

    let totalIncome = 0;

    let totalExpense = 0;


    transactions.forEach(
        function (transaction) {

            if (
                transaction.type === "income"
            ) {

                totalIncome +=
                    transaction.amount;

            } else {

                totalExpense +=
                    transaction.amount;

            }

        }
    );


    const currentBalance =
        totalIncome - totalExpense;


    income.textContent =
        "₹" + totalIncome.toLocaleString("en-IN");


    expense.textContent =
        "₹" + totalExpense.toLocaleString("en-IN");


    balance.textContent =
        "₹" +
        currentBalance.toLocaleString("en-IN");


    budgetSpent.textContent =
        "₹" +
        totalExpense.toLocaleString("en-IN") +
        " spent";


    let percentage =
        (totalExpense / MONTHLY_BUDGET) * 100;


    if (percentage > 100) {

        percentage = 100;

    }


    progressBar.style.width =
        percentage + "%";


    renderTransactions();

}


/* RENDER TRANSACTIONS */

function renderTransactions() {

    transactionList.innerHTML = "";


    if (transactions.length === 0) {

        transactionList.innerHTML = `

            <div class="empty-state">

                <i data-lucide="receipt"></i>

                <p>No transactions yet</p>

                <span>
                    Add your first transaction below
                </span>

            </div>

        `;

        lucide.createIcons();

        return;

    }


    transactions
        .slice(0, 10)
        .forEach(
            function (transaction) {

                const item =
                    document.createElement("div");

                item.className =
                    "transaction-item";


                const icon =
                    getCategoryIcon(
                        transaction.category
                    );


                const sign =
                    transaction.type === "income"
                        ? "+"
                        : "−";


                const amountClass =
                    transaction.type === "income"
                        ? "income-amount"
                        : "expense-amount";


                item.innerHTML = `

                    <div class="transaction-left">

                        <div class="transaction-icon">

                            <i data-lucide="${icon}">
                            </i>

                        </div>


                        <div>

                            <strong>
                                ${transaction.category}
                            </strong>

                            <p>
                                ${transaction.description}
                            </p>

                            <small>
                                ${formatDate(
                                    transaction.date
                                )}
                            </small>

                        </div>

                    </div>


                    <div>

                        <strong
                            class="transaction-amount
                            ${amountClass}">

                            ${sign}₹${transaction.amount
                                .toLocaleString("en-IN")}

                        </strong>


                        <button
                            class="delete-btn"
                            onclick="deleteTransaction(
                                ${transaction.id}
                            )">

                            <i data-lucide="trash-2">
                            </i>

                        </button>

                    </div>

                `;


                transactionList.appendChild(
                    item
                );

            }
        );


    lucide.createIcons();

}


/* DELETE */

function deleteTransaction(id) {

    transactions =
        transactions.filter(
            function (transaction) {

                return transaction.id !== id;

            }
        );


    saveData();

    updateDashboard();

}


/* CATEGORY ICONS */

function getCategoryIcon(category) {

    const icons = {

        Food: "utensils",

        Travel: "bus",

        Study: "book-open",

        Hostel: "house",

        Shopping: "shopping-bag",

        Entertainment: "gamepad-2",

        Other: "package"

    };


    return icons[category] || "circle";

}


/* FORMAT DATE */

function formatDate(date) {

    const parts =
        date.split("-");


    if (parts.length !== 3) {

        return date;

    }


    return (
        parts[2] +
        "/" +
        parts[1] +
        "/" +
        parts[0]
    );

}


/* INITIAL LOAD */

updateDashboard();

lucide.createIcons();
