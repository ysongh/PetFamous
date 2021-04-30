<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light mb-4">
    <div class="container">
      <li class="navbar-brand" data-toggle="collapse" data-target=".navbar-collapse.show">
        <router-link class="nav-link" to="/">
          Pet Famous
        </router-link>
      </li>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
            <router-link class="nav-link" to="/about">About</router-link>
          </li>
          <li class="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
            <router-link class="nav-link" to="/create-pet">Create Pet</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
    name: 'Navbar'
}
</script>