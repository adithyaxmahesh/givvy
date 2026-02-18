# Fix "command not found: npm"

You need **Node.js** (which includes `npm`) before running the app. Choose one option below.

---

## Option A: You use NVM (Node Version Manager)

If you've used NVM before, load it then run the app:

```bash
# Load nvm (add to your ~/.zshrc to run automatically)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node if needed (LTS)
nvm install --lts
nvm use --lts

# Run the app
cd /Users/adithyamahesh/Downloads/equity-marketplace
npm run dev
```

---

## Option B: Install Node.js from nodejs.org (easiest)

1. Go to **https://nodejs.org**
2. Download the **LTS** version and run the installer.
3. **Quit and reopen your terminal** (or restart Cursor).
4. Run:

```bash
cd /Users/adithyamahesh/Downloads/equity-marketplace
npm run dev
```

---

## Option C: Install via Homebrew (Mac)

```bash
brew install node
# Then quit/reopen terminal and:
cd /Users/adithyamahesh/Downloads/equity-marketplace
npm run dev
```

---

## Option D: Install NVM, then Node (good for multiple projects)

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
# Quit and reopen terminal, then:
nvm install --lts
nvm use --lts
cd /Users/adithyamahesh/Downloads/equity-marketplace
npm run dev
```

---

After `npm run dev` works, open **http://localhost:3000** in your browser.
