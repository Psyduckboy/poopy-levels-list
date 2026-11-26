import { store } from "../main.js";
import { embed } from "../util.js";
import { score } from "../score.js";
import { fetchEditors, fetchList, fetchdailylul } from "../content.js";

import Spinner from "../components/Spinner.js";
import LevelAuthors from "../components/List/LevelAuthors.js";

const roleIconMap = {
    owner: "crown",
    admin: "user-gear",
    helper: "user-shield",
    dev: "code",
    trial: "user-lock",
};

export default {
    components: { Spinner, LevelAuthors },
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-list">
            <div class="list-container">
            <input v-model="searchQuery" placeholder="Search for Levels" class="btn" type="text" id="filterForLevelName" style="width: 80%; margin-bottom: 0.5em;">   
                <table class="list" v-if="list && list.length">
                    <tr v-for="(item, i) in filteredListDisplay" :key="item.originalIndex">
                        <td class="rank">
                            <p v-if="item.originalIndex + 1 <= 75" class="type-label-lg">#{{ item.originalIndex + 1 }}</p>
                            <p v-else class="type-label-lg">The Toilet</p>
                        </td>
                        <td class="level" :class="{ 'active': selected == item.originalIndex, 'error': !item.level }">
                            <button @click="selected = item.originalIndex">
                                <span class="type-label-lg">{{ item.level?.name || \`Error (\${err}.json)\` }}</span>
                            </button>
                        </td>
                    </tr>
                </table>
                <p v-if="list && list.length > 0 && filteredListDisplay && filteredListDisplay.length === 0" class="type-body-lg">
                    No levels found matching your search.
                </p>
            </div>
            <div class="level-container">
                <div class="level" v-if="level || selected != null">
                    <h1>{{ level.name }}</h1>
                    <LevelAuthors :author="level.author" :creators="level.creators" :verifier="level.verifier"></LevelAuthors>
                    <iframe class="video" id="videoframe" :src="video" frameborder="0"></iframe>
                    <ul class="stats">
                        <li>
                            <div class="type-title-sm">Points when completed</div>
                            <p>{{ score(selected + 1, 100, level.percentToQualify) }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">ID</div>
                            <p>{{ level.id }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">Initial Placement</div>
                            <p>{{ level.initial || 'N/A' }}</p>
                        </li>
                    </ul>
                    <h2>Records</h2>
                    <p v-if="selected + 1 <= 75"><strong>{{ level.percentToQualify }}%</strong> or better to qualify</p>
                    <p v-else-if="selected +1 <= 150"><strong>100%</strong> or better to qualify</p>
                    <p v-else>This level does not accept new records.</p>
                    <table class="records">
                        <tr v-for="record in level.records" class="record">
                            <td class="percent">
                                <p>{{ record.percent }}%</p>
                            </td>
                            <td class="user">
                                <a :href="record.link" target="_blank" class="type-label-lg">{{ record.user }}</a>
                            </td>
                            <td class="mobile">
                                <img v-if="record.mobile" :src="\`/assets/phone-landscape\${store.dark ? '-dark' : ''}.svg\`" alt="Mobile">
                            </td>
                        </tr>
                    </table>
                </div>
                <div v-else-if="!selected" class="level" style="height: 100%; display: flex; justify-content: center; align-items: center; text-align: center;">
                    <h2>Welcome to the Poopy Levels List!</h2>
                    <p>Click the levels on the left side to see information about them!</p>
                    <p>For more information about the submission rules check the right side!</p>
                    <p>Don't forget to join our <a href="https://discord.gg/Af8hUuHfG3" target="_blank">Discord server</a>!</p>
                    <h2>weekly idk ig</h2>
                    <p>{{ leDaily[0][0].name }} ({{ leDaily[0][0].id }})</p>
                    <button class="btn" @click="selected = Math.floor(Math.random() * list.length)">
                        <span class="type-label-lg">I'm feeling lucky</span>
                    </button>
                </div>
                <div v-else class="level" style="height: 100%; justify-content: center; align-items: center;">
                    <p>Error! (If this error doesn't go away after some time, please contact staff)</p>
                </div>
            </div>
            <div class="meta-container">
                <div class="meta">
                    <div class="errors" v-show="errors.length > 0">
                        <p class="error" v-for="error of errors">{{ error }}</p>
                    </div>
                   <div class="og">
                        <p class="type-label-md">Website layout made by <a href="https://tsl.pages.dev/" target="_blank">The Shitty List</a></p>
                        <p class="type-label-md">Certain features implemented from <a href="https://sgdlist.pages.dev/" target="_blank">The SGD List</a></p>
                        
                    <template v-if="editors">
                        <h3>List Editors</h3>
                        <ol class="editors">
                            <li v-for="editor in editors">
                                <img :src="\`/assets/\${roleIconMap[editor.role]}\${store.dark ? '-dark' : ''}.svg\`" :alt="editor.role">
                                <a v-if="editor.link" class="type-label-lg link" target="_blank" :href="editor.link">{{ editor.name }}</a>
                                <p v-else>{{ editor.name }}</p>
                            </li>
                        </ol>
                    </template>
                    <h3>list rules or sum</h3>

                    <div class="requirements">

                    <p>
                        <strong>submission requirements:</strong>
                    </p>
                    
                    <p>achieved the record without using hacks (CBF/CBS, FPS bypass allowed)</p>

                    <p>must show cheat indicator, if using a mod menu</p>

                    <p>achieved the record on the level that is listed on the site, please check the level ID before you submit a record</p>

                    <p>must have audible or clicks/taps in the video. edited audio only does not count</p>

                    <p>the recording must have a previous attempt and entire death animation shown before the completion, unless the completion is on the first attempt. everyplay records are exempt from this</p>

                    <p>the recording must also show the player hit the endwall, or the completion will be invalidated</p>

                    <p>not recommended to use secret routes or bug routes</p>

                    <p>do not use easy modes, only a record of the unmodified level qualifies</p>

                    <p>once a level falls into The Toilet, records will stop being accepted for the level</p>

                    <p>
                        <strong>level requirements:</strong>
                    </p>

                    <p>levels must be atleast 20 seconds long and at max 2 minutes long (cant be xl)</p>

                    <p>level must be poopy in some aspect, gameplay, deco and must have a text related to poo. no, poo doesnt mean brainrot, unless it has been modified to be poopy</p>

                    <p>levels cant require more than 16 cps</p>
                </div>
            </div>
        </div>
    </div>
        </main>
    `,
    data: () => ({
        list: [],
        editors: [],
        leDaily: [],
        loading: true,
        selected: null,
        errors: [],
        roleIconMap,
        searchQuery: '',
        store
    }),
    computed: {
        level() {
            if (this.selected == null) {
                return 0;
            } else {
                return this.list[this.selected][0];
            }
        },
        video() {
            if (!this.level.showcase) {
                return embed(this.level.verification);
            }

            return embed(
                this.toggledShowcase
                    ? this.level.showcase
                    : this.level.verification
            );
        },
        originalListWithIndex() {
            return (this.list || []).map(([level, err], index) => ({
                level,
                err,
                originalIndex: index,
            }));
        },
        filteredListDisplay() {
            if (!this.searchQuery.trim()) {
                return this.originalListWithIndex;
            }
            const searchTerm = this.searchQuery.toLowerCase();
            return (this.originalListWithIndex || []).filter(item => item.level?.name?.toLowerCase().includes(searchTerm.toLowerCase()));
        },
    },
    async mounted() {
        // Hide loading spinner
        this.list = await fetchList();
        this.editors = await fetchEditors();
        this.leDaily = await fetchdailylul();
        
          
        // Error handling
        if (!this.list) {
            this.errors = [
                "Failed to load list. Retry in a few minutes or notify list staff.",
            ];
        } else {
            this.errors.push(
                ...this.list
                    .filter(([_, err]) => err)
                    .map(([_, err]) => {
                        return `Failed to load level. (${err}.json)`;
                    })
            );
            if (!this.editors) {
                this.errors.push("Failed to load list editors.");
            }
        }

        this.loading = false;
    },
    methods: {
        embed,
        score,
    },
};
