# 💝 Chithi Pathao - Project Documentation

## 📄 Overview: What is this?
**Chithi Pathao** is an interactive, personalized Valentine's Day web application. It allows users to create a unique "digital letter" for their special someone. The recipient is greeted with a charming interface where they are asked to be the sender's Valentine.

### Key Features:
- **Interactive "No" Button**: A playful cat-themed button that dodges the cursor, making it nearly impossible to click "No".
- **Dynamic "Yes" Button**: The "Yes" button grows larger and more inviting as the "No" button is chased.
- **Personalized Experience**: The recipient's name and a custom message from the sender are displayed.
- **Celebration Effects**: Confetti, floating hearts, and romantic music when the recipient says "Yes".
- **Result Sharing**: Options to download the result as an image or share directly to social media (WhatsApp, Instagram).
- **No Backend Required**: The application uses URL query parameters to pass information, making it easy to host and share without a database.

---

## 🌹 Motivation: Why does it exist?
The project was created to:
1. **Spread Joy**: Providing a fun and lighthearted way to celebrate Valentine's Day.
2. **Interactive Storytelling**: Moving away from static greeting cards to an interactive experience that builds anticipation.
3. **Simplicity**: Offering a zero-signup, zero-cost platform for anyone to create a personalized surprise.
4. **Cultural Touch**: Using "Chithi" (meaning "Letter" in Bengali) to evoke a sense of traditional romance in a modern digital format.

---

## 🛠️ Technical Details: How does it work?

### 🔋 Tech Stack
- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/) for a fast, modern development experience.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for a beautiful, responsive, and maintainable UI.
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for smooth transitions, the dodging button logic, and celebratory effects.
- **Components**: [Shadcn UI](https://ui.shadcn.com/) for consistent and accessible UI elements.
- **Image Generation**: [html2canvas](https://html2canvas.hertzen.com/) to allow users to save their "Yes" moment as a high-quality image.
- **State Management**: React's built-in `useState` and `useSearchParams` are used to handle the application flow without needing a complex state library.

### 🏗️ Architecture & Workflow

#### 1. Data Flow
The app is entirely client-side. Data is passed from the **Sender Page** to the **Valentine Page** via URL components:
`https://chithi-pathao.vercel.app/valentine?to=RecipientName&msg=YourCustomMessage`

#### 2. Main Pages
- **Index/Sender Page (`/`)**: The entry point where the user enters the recipient's name and message. It features a countdown to Valentine's Day.
- **Share Page (`/share`)**: Generates the final link and provides tools to copy it or share it via WhatsApp.
- **Valentine Page (`/valentine`)**: The interactive "surprise" page for the recipient.
- **Result Component**: Rendered within the Valentine Page after a choice is made.

#### 3. The "Dodging" Logic
The "No" button's movement is handled by tracking the `noCount` state. On hover or click, the button calculates a random position within its container and uses Framer Motion's `spring` transition to move smoothly.

#### 4. Celebration Logic
Once "Yes" is clicked:
- Confetti is triggered using a dedicated component.
- Background music starts playing.
- The `ValentineResult` component displays the sender's personalized message and festive animations.

---

## 🚀 Future Improvements
- **Themes**: Adding more customizable themes (Retro, Neon, Minimalist).
- **Multiple Languages**: Expanding beyond English and Bengali.
- **Direct Messaging**: Integration with more messaging platforms.
- **Analytics**: Optional opt-in tracking for senders to see when their link was opened.

---
*Created with ❤️ by Faysal Mahmud Prem*
