export default function AuthPage({
  authMode,
  authForm,
  message,
  submitting,
  onModeChange,
  onSubmit,
  onFormChange,
}) {
  return (
    <main className="auth-layout simple-auth-layout">
      <section className="auth-card simple-auth-card">
        <p className="eyebrow">Todo App</p>
        <h1>{authMode === "register" ? "Create account" : "Login"}</h1>
        <p className="subtitle auth-subtitle">
          {authMode === "register"
            ? "Create an account to manage your task groups."
            : "Login to manage your lists and tasks."}
        </p>

        <div className="auth-switch">
          <button
            className={authMode === "login" ? "active" : ""}
            onClick={() => onModeChange("login")}
            type="button"
          >
            Login
          </button>
          <button
            className={authMode === "register" ? "active" : ""}
            onClick={() => onModeChange("register")}
            type="button"
          >
            Register
          </button>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          {authMode === "register" ? (
            <label>
              Name
              <input
                value={authForm.name}
                onChange={(event) => onFormChange("name", event.target.value)}
                placeholder="Your name"
              />
            </label>
          ) : null}

          <label>
            Email
            <input
              type="email"
              value={authForm.email}
              onChange={(event) => onFormChange("email", event.target.value)}
              placeholder="name@example.com"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={authForm.password}
              onChange={(event) => onFormChange("password", event.target.value)}
              placeholder="Enter password"
            />
          </label>

          <button className="primary-button" disabled={submitting} type="submit">
            {submitting ? "Please wait..." : authMode === "register" ? "Create account" : "Login"}
          </button>
        </form>

        {message ? <p className="feedback">{message}</p> : null}

        <p className="auth-note">
          {authMode === "register"
            ? "Already have an account? Switch to login."
            : "New user? Switch to register."}
        </p>
      </section>
    </main>
  );
}
