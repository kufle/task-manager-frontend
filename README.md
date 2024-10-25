<h3>Backend Access</h3>
<p>The backend repository can be accessed on GitHub: <a href="https://github.com/kufle/task-manager-backend">Backend Repository</a>.</p>
<h2>Getting Started</h2>
<p>Follow these steps to set up and run the project locally.</p>

<h3>Prerequisites</h3>
<ul>
  <li>Node.js and npm installed on your machine</li>
</ul>

<h3>Installation</h3>
<ol>
  <li><strong>Clone the Repository</strong>
    <pre><code>git clone &lt;repository-url&gt;</code></pre>
  </li>
  <li><strong>Configure API Base URL</strong>
    <ul>
      <li>Open <code>src/config.tsx</code>.</li>
      <li>Set the base URL for the API in the <code>BASE_URL</code> variable to point to the backend server.</li>
    </ul>
  </li>
  <li><strong>Install Dependencies</strong>
    <pre><code>npm install</code></pre>
  </li>
  <li><strong>Run the Development Server</strong>
    <pre><code>npm run dev</code></pre>
  </li>
</ol>

<h3>Usage</h3>
<p>After starting, the project will be available at <code>http://localhost:3000</code> (or the default port set in the project).</p>