<script type='module'>
	import { setClient } from 'svelte-apollo';
	import Router from 'svelte-spa-router'

	import routes from './routes/index'
	import { client } from './apollo';

    setClient(client);
</script>

<body>
	<Router {routes} />
</body>

<style>
    body {
        text-align: center;
        padding: 1em;
        max-width: 960px;
        margin: 0 auto;
    }
</style>
