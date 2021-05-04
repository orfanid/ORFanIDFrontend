<template>
     <nav>
        <div class="nav-wrapper teal">
            <a href="/" class="brand-logo" style="margin-left: 50px;">ORFanID</a>
            <ul id="nav-mobile" class="right hide-on-med-and-down">
                <li><router-link to="/input">Home</router-link></li>
                <li><router-link to="/results">Results</router-link></li>
                <li><router-link to="/orfanbase">ORFanBase</router-link></li>
                <li><router-link to="/clamp">Clamp Project</router-link></li>
                <li><router-link to="/instructions">Instructions</router-link></li>
            </ul>
        </div>
    </nav>
</template>

<script >
export default {
  name: 'Header',
};
</script>
