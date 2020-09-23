<script>
	import { setClient } from 'svelte-apollo';
    import Router from 'svelte-spa-router';
    import TailwindCss from './TailwindCss.svelte';

	import routes from './routes/';
	import { client } from './apollo';

    setClient(client);
</script>

<TailwindCss/>
<body>
	<Router {routes} />
</body>

