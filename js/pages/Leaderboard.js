
import { fetchLeaderboard } from '../content.js';
import { localize } from '../util.js';

import Spinner from '../components/Spinner.js';

export default {
    components: {
        Spinner,
    },
    data: () => ({
        leaderboard: [],
        loading: true,
        selected: null,
        searchQuery: '',
        err: [],
    }),
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-leaderboard-container">
            <div class="page-leaderboard">
                <div class="error-container">
                    <p class="error" v-if="err.length > 0">
                        Leaderboard may be incorrect, as the following levels could not be loaded: {{ err.join(', ') }}
                    </p>
                </div>

                <div class="board-container">
                    <input
                        v-model="searchQuery"
                        placeholder="Search for Players"
                        class="btn"
                        type="text"
                        style="width: 80%; margin-bottom: 0.5em;"
                    >

                    <table class="board">
                        <tr v-for="item in filteredLeaderboard" :key="item.originalIndex">
                            <td class="rank">
                                <p class="type-label-lg">#{{ item.originalIndex + 1 }}</p>
                            </td>
                            <td class="total">
                                <p class="type-label-lg">{{ localize(item.total) }}</p>
                            </td>
                            <td class="user" :class="{ 'active': selected == item.originalIndex }">
                                <button @click="selected = item.originalIndex">
                                    <span class="type-label-lg">{{ item.user }}</span>
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>

                <div class="player-container">
                    <div class="player" v-if="entry">
                        <h1>#{{ selected + 1 }} {{ entry.user }}</h1>
                        <h3>{{ entry.total }}</h3>

                        <h2 v-if="entry.verified.length > 0">Verified ({{ entry.verified.length }})</h2>
                        <table class="table">
                            <tr v-for="score in entry.verified">
                                <td class="rank"><p>#{{ score.rank }}</p></td>
                                <td class="level">
                                    <a class="type-label-lg" target="_blank" :href="score.link">{{ score.level }}</a>
                                </td>
                                <td class="score"><p>+{{ localize(score.score) }}</p></td>
                            </tr>
                        </table>

                        <h2 v-if="entry.completed.length > 0">Completed ({{ entry.completed.length }})</h2>
                        <table class="table">
                            <tr v-for="score in entry.completed">
                                <td class="rank"><p>#{{ score.rank }}</p></td>
                                <td class="level">
                                    <a class="type-label-lg" target="_blank" :href="score.link">{{ score.level }}</a>
                                </td>
                                <td class="score"><p>+{{ localize(score.score) }}</p></td>
                            </tr>
                        </table>

                        <h2 v-if="entry.progressed.length > 0">Progressed ({{ entry.progressed.length }})</h2>
                        <table class="table">
                            <tr v-for="score in entry.progressed">
                                <td class="rank"><p>#{{ score.rank }}</p></td>
                                <td class="level">
                                    <a class="type-label-lg" target="_blank" :href="score.link">{{ score.percent }}% {{ score.level }}</a>
                                </td>
                                <td class="score"><p>+{{ localize(score.score) }}</p></td>
                            </tr>
                        </table>
                    </div>

                    <div v-else class="player">
                        <h2>Welcome to the PLL Leaderboard!</h2>
                        <p>Click a player on the left side to see their stats!</p>
                        <p>To get on the leaderboard, submit your records and levels with submission form, available through the button in the top right!</p>
                    </div>
                </div>
            </div>
        </main>
    `,
    computed: {
        entry() {
            return this.selected == null ? null : this.leaderboard[this.selected];
        },
        filteredLeaderboard() {
            const search = this.searchQuery.toLowerCase().trim();

            return this.leaderboard
                .map((entry, index) => ({
                    ...entry,
                    originalIndex: index,
                }))
                .filter(entry =>
                    String(entry.user || '').toLowerCase().includes(search)
                );
        },
    },
    async mounted() {
        const [leaderboard, err] = await fetchLeaderboard();
        this.leaderboard = leaderboard;
        this.err = err;
        this.loading = false;
    },
    methods: {
        localize,
    },
};
