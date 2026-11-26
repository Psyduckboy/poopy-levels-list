import { round, score } from './score.js';

/**
 * Path to directory containing `_list.json` and all levels
 */
const dir = '/data';

export async function fetchList() {
    const listResult = await fetch(`${dir}/_list.json`);
    try {
        const list = await listResult.json();
        return await Promise.all(
            list.map(async (path, rank) => {
                const levelResult = await fetch(`${dir}/${path}.json`);
                try {
                    const level = await levelResult.json();
                    return [
                        {
                            ...level,
                            path,
                            records: level.records.sort(
                                (a, b) => b.percent - a.percent,
                            ),
                        },
                        null,
                    ];
                } catch {
                    console.error(`Failed to load level #${rank + 1} ${path}.`);
                    return [null, path];
                }
            }),
        );
    } catch {
        console.error(`Failed to load list.`);
        return null;
    }
}

export async function fetchEditors() {
    try {
        const editorsResults = await fetch(`${dir}/_editors.json`);
        const editors = await editorsResults.json();
        return editors;
    } catch {
        return null;
    }
}
export async function fetchDates() {
    try {
        const datesResults = await fetch(`${dir}/_oldlists.json`);
        const dates = await datesResults.json();
        return dates;
    } catch {
        return null;
    }
}

export async function fetchLeaderboard() {
    const list = await fetchList();

    const scoreMap = {};
    const errs = [];

    list.forEach(([level, err], rank) => {
        if (err) {
            errs.push(err);
            return;
        }

        // Verification
        const verifier = Object.keys(scoreMap).find(
            (u) => u.toLowerCase() === level.verifier.toLowerCase(),
        ) || level.verifier;

        scoreMap[verifier] ??= {
            verified: [],
            completed: [],
            progressed: [],
            created: [],
        };

        scoreMap[verifier].verified.push({
            rank: rank + 1,
            level: level.name,
            score: score(rank + 1, 100, level.percentToQualify),
            link: level.verification,
        });

        // Created
        (Array.isArray(level.creators) ? level.creators : []).forEach((creator) => {
            const user = Object.keys(scoreMap).find(
                (u) => u.toLowerCase() === creator.toLowerCase(),
            ) || creator;

            scoreMap[user] ??= {
                verified: [],
                completed: [],
                progressed: [],
                created: [],
            };

            scoreMap[user].created.push({
                rank: rank + 1,
                level: level.name,
                link: level.verification,
            });
        });

        // Records
        level.records.forEach((record) => {
            const user = Object.keys(scoreMap).find(
                (u) => u.toLowerCase() === record.user.toLowerCase(),
            ) || record.user;

            scoreMap[user] ??= {
                verified: [],
                completed: [],
                progressed: [],
                created: [],
            };

            const { completed, progressed } = scoreMap[user];

            if (record.percent === 100) {
                completed.push({
                    rank: rank + 1,
                    level: level.name,
                    score: score(rank + 1, 100, level.percentToQualify),
                    link: record.link,
                });
                return;
            }

            progressed.push({
                rank: rank + 1,
                level: level.name,
                percent: record.percent,
                score: score(rank + 1, record.percent, level.percentToQualify),
                link: record.link,
            });
        });
    });

    // Calculate total points
    const res = Object.entries(scoreMap).map(([user, scores]) => {
        const { verified, completed, progressed } = scores;
        const total = [verified, completed, progressed]
            .flat()
            .reduce((prev, cur) => prev + cur.score, 0);

        return {
            user,
            total: round(total),
            ...scores,
        };
    });

    return [res.sort((a, b) => b.total - a.total), errs];
}
    export async function fetchPacks() {
        const packsResult = await fetch(`${dir}/_packs.json`);
        try {
            
            const packs = await packsResult.json();
            return await Promise.all(
                packs.map(async (path, rank) => {
                    console.error(`${dir}/packs/${path}.json`);
                    const packResult = await fetch(`${dir}/packs/${path}.json`);
                    try {
                        const pack = await packResult.json();
                        return [
                            {
                                ...pack,
                            },
                            null,
                        ];
                    } catch {
                        console.error(`Failed to load pack #${rank + 1} ${path}.`);
                        return [null, path];
                    }
                }),
            );
        } catch {
            console.error(`Failed to load packs.`);
            return null;
        }
    }
export async function fetchChangelog() {
    try {
        const changelogResults = await fetch(`${dir}/_changelog.json`);
        const changelog = await changelogResults.json();
        return changelog;
    } catch {
        return null;
    }
}

export async function fetchdailylul() {
    const listResult = await fetch(`${dir}/_le daily.json`);
    try {
        const list = await listResult.json();
        return await Promise.all(
            list.map(async (path, rank) => {
                const levelResult = await fetch(`${dir}/${path}.json`);
                try {
                    const level = await levelResult.json();
                    return [
                        {
                            ...level,
                            path,
                            records: level.records.sort(
                                (a, b) => b.percent - a.percent,
                            ),
                        },
                        null,
                    ];
                } catch {
                    console.error(`Failed to load le daily #${rank + 1} ${path}.`);
                    return [null, path];
                }
            }),
        );
    } catch {
        console.error(`Failed to load le daily.`);
        return null;
    }
}
