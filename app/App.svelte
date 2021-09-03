<page>
    <actionBar title="Pomo d'oro" />
    <gridLayout>
        <Timer></Timer>
        <!-- <label class="info" horizontalAlignment="center" verticalAlignment="middle" textWrap="true">
            <formattedString>
                <span class="fas" text="&#xf135;" />
                <span text=" {message}" />
            </formattedString>
        </label> -->
    </gridLayout>
</page>

<script lang="typescript">
    import Timer from './components/Timer.svelte'

    let message: string = "Svelte Native App"

    let eDarkMode = (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);

    function init() {
        // this.caricaStato();
        chiediServer();
        impostiTimer();
        autoRiprendi();
    },
</script>

<style>
    .info .fas {
        color: #3A53FF;
    }
    .info {
        font-size: 20;
    }
</style>
