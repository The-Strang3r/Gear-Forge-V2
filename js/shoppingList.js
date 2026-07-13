import { getSelectedEnchants } from "./buttons.js";

let copyButtonWired = false;

/**
 * Collects every selected enchantment and combines duplicate books.
 *
 * Example:
 * Mending selected on four items becomes:
 * Mending × 4
 */
function collectSelectedBooks() {
  const books = new Map();

  document.querySelectorAll(".armor-piece").forEach((pieceDiv) => {
    const enchants = getSelectedEnchants(pieceDiv);

    enchants.forEach((enchant) => {
      books.set(enchant, (books.get(enchant) || 0) + 1);
    });
  });

  return Array.from(books.entries())
    .map(([name, quantity]) => ({
      name,
      quantity
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function getTotalBookCount(books) {
  return books.reduce((total, book) => {
    return total + book.quantity;
  }, 0);
}

function getBookCountLabel(count) {
  return `${count} ${count === 1 ? "book" : "books"}`;
}

function buildCopyText(books) {
  if (books.length === 0) {
    return "No enchanted books selected.";
  }

  const total = getTotalBookCount(books);

  const lines = books.map((book) => {
    return book.quantity > 1
      ? `${book.name} x${book.quantity}`
      : book.name;
  });

  return [
    "Gear Forge Book Shopping List",
    getBookCountLabel(total),
    "",
    ...lines
  ].join("\n");
}

function wireCopyButton() {
  if (copyButtonWired) return;

  const copyButton = document.getElementById("copy-shopping-list");
  if (!copyButton) return;

  copyButtonWired = true;

  copyButton.addEventListener("click", async () => {
    const books = collectSelectedBooks();

    if (books.length === 0) return;

    const text = buildCopyText(books);

    try {
      await navigator.clipboard.writeText(text);

      const originalText = copyButton.textContent;
      copyButton.textContent = "Copied!";

      setTimeout(() => {
        copyButton.textContent = originalText;
      }, 1200);
    } catch (error) {
      console.error("Unable to copy shopping list:", error);

      copyButton.textContent = "Copy Failed";

      setTimeout(() => {
        copyButton.textContent = "Copy List";
      }, 1200);
    }
  });
}

export function updateShoppingList() {
  const countElement = document.getElementById("shopping-list-count");
  const itemsElement = document.getElementById("shopping-list-items");
  const copyButton = document.getElementById("copy-shopping-list");

  if (!countElement || !itemsElement || !copyButton) return;

  wireCopyButton();

  const books = collectSelectedBooks();
  const totalBooks = getTotalBookCount(books);

  countElement.textContent = getBookCountLabel(totalBooks);
  copyButton.disabled = books.length === 0;

  if (books.length === 0) {
    itemsElement.innerHTML = `
      <div class="shopping-list-empty">
        Select enchantments to build a book list.
      </div>
    `;

    return;
  }

  itemsElement.innerHTML = books
    .map((book) => {
      const quantity = book.quantity > 1
        ? `<span class="shopping-list-quantity">×${book.quantity}</span>`
        : "";

      return `
        <div class="shopping-list-item">
          <span class="shopping-list-book-name">
            ${book.name}
          </span>

          ${quantity}
        </div>
      `;
    })
    .join("");
}