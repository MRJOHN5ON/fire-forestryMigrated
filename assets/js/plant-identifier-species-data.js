/**
 * Montana & Northern Rockies fire-risk and land-management notes for Pl@ntNet matches.
 * Order does not matter — plant-identifier.js scores best match by name specificity.
 */
window.PLANT_IDENTIFIER_SPECIES = [
  // --- CONIFERS ---
  {
    risk: 'high',
    riskLabel: 'High fire risk',
    names: ['ponderosa pine', 'pinus ponderosa', 'western yellow pine'],
    displayName: 'Ponderosa Pine',
    note: '\uD83D\uDD34 High fire risk near structures. Resinous conifer and one of the most common fire-danger trees in Southwest Montana. Thick bark gives mature trees some resistance, but needle litter and low branches create ladder fuels. Remove branches within 10 feet of the ground and keep 30 feet of clearance from structures. Dead or beetle-damaged trees are extreme hazards.'
  },
  {
    risk: 'high',
    riskLabel: 'High fire risk',
    names: ['douglas fir', 'douglas-fir', 'pseudotsuga menziesii', 'rocky mountain douglas-fir'],
    displayName: 'Douglas Fir',
    note: '\uD83D\uDD34 High fire risk. Thin bark, heat-sensitive needles, and shallow roots \u2014 poor fire survival and intense burning when dry. Crown scorch often kills the tree. Dense stands drive stand-replacing crown fires. Prioritize thinning and removal in defensible space zones, especially on north-facing slopes where it dominates.'
  },
  {
    risk: 'extreme',
    riskLabel: 'Extreme fire risk',
    names: ['lodgepole pine', 'pinus contorta', 'shore pine'],
    displayName: 'Lodgepole Pine',
    note: '\uD83D\uDD34 Extreme fire risk in dense stands. Fire-adapted species built to burn under hot, dry conditions. Even-aged thickets and mountain pine beetle kill (grey-stage snags) are among Montana\u2019s highest-risk fuel beds. Defensible space consultation strongly recommended near homes.'
  },
  {
    risk: 'high',
    riskLabel: 'High fire risk',
    names: ['engelmann spruce', 'picea engelmannii'],
    displayName: 'Engelmann Spruce',
    note: '\uD83D\uDD34 High fire risk. Dense spruce stands hold moisture in cool sites but become explosive ladder-fuel columns when dry. Low branches and dead interior needles accumulate. Thin around structures and break up continuous conifer cover on slopes above homes.'
  },
  {
    risk: 'high',
    riskLabel: 'High fire risk',
    names: ['subalpine fir', 'abies lasiocarpa'],
    displayName: 'Subalpine Fir',
    note: '\uD83D\uDD34 High fire risk. Shallow-rooted fir with resinous foliage and heavy duff buildup. Common at higher elevations; when fire reaches fir-dominated stands, intensity increases quickly. Reduce density within 100 feet of structures where feasible.'
  },
  {
    risk: 'high',
    riskLabel: 'High fire risk',
    names: ['grand fir', 'abies grandis'],
    displayName: 'Grand Fir',
    note: '\uD83D\uDD34 High fire risk. Less fire-tolerant than ponderosa; retains low branches and builds deep needle litter. Increasingly common in moist draws \u2014 converts sites to higher-intensity fire behavior. Ladder fuel removal is critical near structures.'
  },
  {
    risk: 'high',
    riskLabel: 'High fire risk',
    names: ['western white pine', 'pinus monticola'],
    displayName: 'Western White Pine',
    note: '\uD83D\uDD34 High fire risk. Large crowns and resinous wood; susceptible to white pine blister rust which creates standing dead fuel. Maintain spacing between trees and remove dead/dying stems in defensible space.'
  },
  {
    risk: 'high',
    riskLabel: 'High fire risk',
    names: ['limber pine', 'pinus flexilis'],
    displayName: 'Limber Pine',
    note: '\uD83D\uDD34 High fire risk. High-elevation pine with resinous foliage; white pine blister rust and beetle activity increase standing dead hazard. Important wildlife tree \u2014 balance retention away from structures with removal near homes.'
  },
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk',
    names: ['whitebark pine', 'pinus albicaulis'],
    displayName: 'Whitebark Pine',
    note: '\uD83D\uDFE1 Moderate \u2014 context dependent. High-elevation species; fire risk rises when stands are beetle-killed or drought-stressed. Federally threatened \u2014 avoid unnecessary removal except where dead trees threaten structures.'
  },
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk',
    names: ['western larch', 'larix occidentalis', 'tamarack'],
    displayName: 'Western Larch',
    note: '\uD83D\uDFE1 Moderate fire risk. Deciduous conifer drops needles in fall, reducing winter surface fuel compared to evergreen conifers. Still a large woody fuel when mature. Generally more fire-resistant than spruce/fir but treat heavy deadwood near structures.'
  },
  {
    risk: 'very_high',
    riskLabel: 'Very high fire risk',
    names: ['rocky mountain juniper', 'juniperus scopulorum', 'western juniper', 'juniperus occidentalis'],
    displayName: 'Rocky Mountain Juniper',
    note: '\uD83D\uDD34 Very high fire risk. Volatile oils, dense dead interior material, and low branching make juniper one of the most flammable landscape plants in Montana. Never within 5 feet of structures; thin heavily or remove from Zone 1 defensible space.'
  },
  {
    risk: 'very_high',
    riskLabel: 'Very high fire risk',
    names: ['juniper', 'juniperus'],
    displayName: 'Juniper',
    note: '\uD83D\uDD34 Very high fire risk. Volatile foliage and accumulated dead fuel inside the crown create intense fire. Remove or heavily thin within defensible space, especially near foundations and decks.'
  },

  // --- DECIDUOUS TREES ---
  {
    risk: 'low',
    riskLabel: 'Lower fire risk',
    names: ['quaking aspen', 'populus tremuloides', 'aspen'],
    displayName: 'Aspen',
    note: '\uD83D\uDFE2 Lower fire risk \u2014 relatively fire-resistant. High leaf moisture when healthy; often recommended as a buffer species in defensible space. Stressed, drought-killed, or dense dead aspen stands become hazardous \u2014 assess standing dead near structures.'
  },
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk',
    names: ['cottonwood', 'populus deltoides', 'populus trichocarpa', 'populus angustifolia', 'narrowleaf cottonwood', 'black cottonwood', 'plains cottonwood'],
    displayName: 'Cottonwood',
    note: '\uD83D\uDFE1 Moderate \u2014 context dependent. Riparian tree; more fire-resistant when leafed out and healthy. Dead limbs, drought stress, and hollow boles create falling and ignition hazards. Large cottonwoods near structures need structural and deadwood assessment.'
  },
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk',
    names: ['paper birch', 'betula papyrifera', 'water birch', 'betula occidentalis'],
    displayName: 'Birch',
    note: '\uD83D\uDFE1 Moderate fire risk. Thin-barked deciduous tree; less flammable than conifers when green but carries flammable papery bark and fine twigs. Keep leaf litter and bark debris cleared near structures.'
  },
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk',
    names: ['rocky mountain maple', 'acer glabrum', 'boxelder', 'acer negundo'],
    displayName: 'Maple',
    note: '\uD83D\uDFE1 Moderate fire risk. Deciduous with moderate fuel load; often grows as understory ladder fuel beneath conifers. Thin maples that bridge ground fuels to tree crowns within defensible space.'
  },
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk',
    names: ['chokecherry', 'prunus virginiana'],
    displayName: 'Chokecherry',
    note: '\uD83D\uDFE1 Moderate fire risk. Native shrub or small tree; fine branches and leaf litter can carry surface fire. Useful wildlife plant \u2014 prune up and away from structures rather than blanket removal unless overgrown.'
  },
  {
    risk: 'low',
    riskLabel: 'Lower fire risk',
    names: ['green ash', 'fraxinus pennsylvanica'],
    displayName: 'Green Ash',
    note: '\uD83D\uDFE2 Lower to moderate fire risk. Planted shade tree; less flammable than conifers when healthy. Emerald ash borer is spreading \u2014 dead ash near structures should be removed promptly.'
  },

  // --- SHRUBS & WOODY PLANTS ---
  {
    risk: 'very_high',
    riskLabel: 'Very high fire risk',
    names: ['big sagebrush', 'artemisia tridentata', 'sagebrush', 'basin big sagebrush', 'mountain big sagebrush', 'wyoming big sagebrush'],
    displayName: 'Big Sagebrush',
    note: '\uD83D\uDD34 Very high fire risk when cured. Dominant shrub of Montana sagebrush steppe; volatile oils and fine structure carry fast crown fires in shrubs. Mow or graze fine fuels where allowed; maintain breaks between shrub fields and structures.'
  },
  {
    risk: 'high',
    riskLabel: 'High fire risk',
    names: ['rabbitbrush', 'ericameria nauseosa', 'chrysothamnus nauseosus', 'rubber rabbitbrush'],
    displayName: 'Rabbitbrush',
    note: '\uD83D\uDD34 High fire risk when dry. Fine twigs and resinous foliage ignite easily. Native but can form dense patches after disturbance. Thin patches within 30 feet of structures.'
  },
  {
    risk: 'high',
    riskLabel: 'High fire risk',
    names: ['greasewood', 'sarcobatus vermiculatus', 'black greasewood'],
    displayName: 'Greasewood',
    note: '\uD83D\uDD34 High fire risk. Salty desert shrub with oily, resinous wood; burns hot and fast. Common in alkaline valleys. Maintain wide fuel breaks between greasewood stands and buildings.'
  },
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk',
    names: ['bitterbrush', 'purshia tridentata', 'antelope bitterbrush'],
    displayName: 'Bitterbrush',
    note: '\uD83D\uDFE1 Moderate fire risk. Important native wildlife browse; fine fuels when dry. Valuable on the landscape \u2014 focus on spacing and pruning near homes rather than wholesale removal.'
  },
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk',
    names: ['mountain mahogany', 'cerocarpus ledifolius', 'curlleaf mountain-mahogany', 'alderleaf mountain mahogany'],
    displayName: 'Mountain Mahogany',
    note: '\uD83D\uDFE1 Moderate fire risk. Dense evergreen shrub on dry slopes; slow-growing but builds flammable fine fuel. Thin within defensible space while preserving established plants away from structures.'
  },
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk',
    names: ['serviceberry', 'amelanchier alnifolia', 'saskatoon', 'western serviceberry'],
    displayName: 'Serviceberry',
    note: '\uD83D\uDFE1 Moderate fire risk. Native shrub or small tree; moderate fuel load. Good wildlife value. Prune low branches and maintain separation from siding and decks.'
  },
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk',
    names: ['wild rose', 'rosa woodsii', 'wood rose', 'prickly rose', 'rosa acicularis'],
    displayName: 'Wild Rose',
    note: '\uD83D\uDFE1 Moderate fire risk. Thorny native shrub; dense patches carry surface fire. Clear within 5 feet of structures; patchy retention away from the home is usually fine.'
  },
  {
    risk: 'low',
    riskLabel: 'Lower fire risk',
    names: ['snowberry', 'symphoricarpos albus', 'creeping snowberry', 'symphoricarpos oreophilus'],
    displayName: 'Snowberry',
    note: '\uD83D\uDFE2 Lower fire risk. Deciduous native shrub; generally less flammable than evergreen brush when leafed out. Still clear heavy buildup against foundations.'
  },
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk',
    names: ['ocean spray', 'holodiscus discolor', 'creambush'],
    displayName: 'Ocean Spray',
    note: '\uD83D\uDFE1 Moderate fire risk. Woody native shrub common on dry slopes; fine twig structure carries fire. Thin dense patches near structures and along driveways.'
  },
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk',
    names: ['ninebark', 'physocarpus malvaceus', 'physocarpus capitatus', 'common ninebark'],
    displayName: 'Ninebark',
    note: '\uD83D\uDFE1 Moderate fire risk. Native riparian and slope shrub; peeling bark and fine stems add surface fuel. Prune up and back from structures.'
  },
  {
    risk: 'low',
    riskLabel: 'Lower fire risk',
    names: ['red-osier dogwood', 'cornus sericea', 'red twig dogwood'],
    displayName: 'Red-osier Dogwood',
    note: '\uD83D\uDFE2 Lower fire risk. Deciduous riparian shrub; higher moisture in green season. Dead red stems in winter still carry some risk \u2014 thin dense thickets near buildings.'
  },
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk',
    names: ['buffaloberry', 'shepherdia canadensis', 'shepherdia argentea', 'silver buffaloberry'],
    displayName: 'Buffaloberry',
    note: '\uD83D\uDFE1 Moderate fire risk. Thorny native shrub; can form impenetrable thickets that carry fire. Clear within defensible space zones.'
  },
  {
    risk: 'high',
    riskLabel: 'High fire risk',
    names: ['common juniper', 'juniperus communis'],
    displayName: 'Common Juniper',
    note: '\uD83D\uDD34 High fire risk. Low-growing juniper with volatile oils \u2014 same concerns as tree junipers. Remove from Zone 1; do not use as foundation planting in fire-prone areas.'
  },
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk',
    names: ['hawthorn', 'crataegus', 'crataegus chrysocarpa', 'crataegus suksdorfii'],
    displayName: 'Hawthorn',
    note: '\uD83D\uDFE1 Moderate fire risk. Thorny small tree or shrub; dense branching adds ladder fuels. Prune and thin near structures; remove volunteers against buildings.'
  },
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk',
    names: ['common lilac', 'syringa vulgaris', 'syringa'],
    displayName: 'Lilac',
    note: '\uD83D\uDFE1 Moderate fire risk. Common yard shrub; dense dead interior wood accumulates without maintenance. Thin and remove dead stems; keep 5+ feet from siding.'
  },
  {
    risk: 'high',
    riskLabel: 'High fire risk — invasive',
    names: ['russian olive', 'elaeagnus angustifolia'],
    displayName: 'Russian Olive',
    note: '\uD83D\uDD34 High fire risk \u2014 invasive. Noxious weed in Montana; silvery foliage dries to flammable fine fuel along rivers and fields. Removal recommended \u2014 contact county weed district for control guidance.'
  },
  {
    risk: 'high',
    riskLabel: 'High fire risk — invasive',
    names: ['saltcedar', 'tamarix', 'tamarisk'],
    displayName: 'Saltcedar',
    note: '\uD83D\uDD34 High fire risk \u2014 invasive riparian species. Fine fuels and dead material accumulate; alters streamside ecology. Report and remove where possible in Montana riparian zones.'
  },

  // --- INVASIVE GRASSES & FORBS ---
  {
    risk: 'extreme',
    riskLabel: 'Extreme fire risk — invasive',
    names: ['cheatgrass', 'bromus tectorum', 'downy brome'],
    displayName: 'Cheatgrass',
    note: '\uD83D\uDD34 Extreme fire risk \u2014 invasive. Cures early, carries fast surface fires, and colonizes burn scars in a worsening fire-grass cycle. Any significant presence near structures demands fuel treatment and ground management.'
  },
  {
    risk: 'extreme',
    riskLabel: 'Extreme fire risk — invasive',
    names: ['medusahead', 'taeniatherum caput-medusae'],
    displayName: 'Medusahead',
    note: '\uD83D\uDD34 Extreme fire risk \u2014 invasive annual grass. Silica-rich thatch resists decomposition and creates a continuous fine-fuel bed. Among the worst post-fire invaders in the Interior West. Early detection and treatment critical.'
  },
  {
    risk: 'high',
    riskLabel: 'High fire risk — invasive',
    names: ['ventenata', 'ventenata dubia', 'wiregrass'],
    displayName: 'Ventenata',
    note: '\uD83D\uDD34 High fire risk \u2014 invasive annual grass spreading in Montana. Fine fuel that cures early and carries fire across rangeland. Report new infestations to your county weed coordinator.'
  },
  {
    risk: 'high',
    riskLabel: 'High fire risk — invasive',
    names: ['smooth brome', 'bromus inermis'],
    displayName: 'Smooth Brome',
    note: '\uD83D\uDD34 High fire risk \u2014 invasive pasture grass. Dense thatch and early curing create continuous fine fuels. Common in old fields and roadsides; mowing before seed set and reseeding with natives reduces fire carry.'
  },
  {
    risk: 'high',
    riskLabel: 'High fire risk — invasive',
    names: ['reed canary grass', 'phalaris arundinacea'],
    displayName: 'Reed Canary Grass',
    note: '\uD83D\uDD34 High fire risk \u2014 invasive wetland grass. Dense dead stems carry fire in ditches and moist areas where fire is often unexpected. Control in riparian zones improves both ecology and fire safety.'
  },
  {
    risk: 'high',
    riskLabel: 'High fire risk — invasive',
    names: ['quackgrass', 'elymus repens', 'elytrigia repens', 'couch grass'],
    displayName: 'Quackgrass',
    note: '\uD83D\uDD34 High fire risk when dry. Aggressive rhizomatous grass; fine fuel along fencelines and disturbed ground. Mow and manage before it cures; competes with native grasses.'
  },
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk — invasive',
    names: ['spotted knapweed', 'centaurea stoebe', 'centaurea maculosa'],
    displayName: 'Spotted Knapweed',
    note: '\uD83D\uDFE1 Moderate fire risk \u2014 invasive. Montana noxious weed; dry stalks add fine fuel and displace native vegetation. Biological and herbicide control available through weed districts.'
  },
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk — invasive',
    names: ['diffuse knapweed', 'centaurea diffusa'],
    displayName: 'Diffuse Knapweed',
    note: '\uD83D\uDFE1 Moderate fire risk \u2014 invasive noxious weed. Increases bare ground and fine fuels after establishment. Treat early; seeds remain viable in soil for years.'
  },
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk — invasive',
    names: ['yellow starthistle', 'centaurea solstitialis'],
    displayName: 'Yellow Starthistle',
    note: '\uD83D\uDFE1 Moderate fire risk \u2014 invasive. Spiny annual; dry plants add surface fuel. Priority noxious weed \u2014 report and treat to prevent spread in Montana.'
  },
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk — invasive',
    names: ['dalmatian toadflax', 'linaria dalmatica'],
    displayName: 'Dalmatian Toadflax',
    note: '\uD83D\uDFE1 Moderate fire risk \u2014 invasive. Waxy leaves and woody stems; dense patches alter fuel structure on disturbed sites. Montana listed noxious weed.'
  },
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk — invasive',
    names: ['yellow toadflax', 'linaria vulgaris', 'butter and eggs'],
    displayName: 'Yellow Toadflax',
    note: '\uD83D\uDFE1 Moderate fire risk \u2014 invasive. Persistent rhizomes; dry stems add fine fuel along roads and pastures. Integrated weed management recommended.'
  },
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk — invasive',
    names: ['leafy spurge', 'euphorbia esula'],
    displayName: 'Leafy Spurge',
    note: '\uD83D\uDFE1 Moderate fire risk \u2014 invasive. Milky sap; forms dense patches that displace grazing and native plants. Dry spurge adds surface fuel \u2014 biocontrol beetles widely used in Montana.'
  },
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk — invasive',
    names: ['canada thistle', 'cirsium arvense'],
    displayName: 'Canada Thistle',
    note: '\uD83D\uDFE1 Moderate fire risk \u2014 invasive noxious weed. Rhizomatous patches create fine fuel and bare ground after fire. Persistent \u2014 treat with a multi-year plan.'
  },
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk — invasive',
    names: ['musk thistle', 'nodding thistle', 'carduus nutans'],
    displayName: 'Musk Thistle',
    note: '\uD83D\uDFE1 Moderate fire risk \u2014 invasive biennial. Tall dry stalks add ladder-like fine fuel. Montana noxious weed; rosette-stage treatment most effective.'
  },
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk — invasive',
    names: ['houndstongue', 'cynoglossum officinale'],
    displayName: 'Houndstongue',
    note: '\uD83D\uDFE1 Moderate fire risk \u2014 invasive. Biennial with burr seeds; dry plants add surface fuel. Toxic to livestock \u2014 listed noxious weed in Montana.'
  },
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk — invasive',
    names: ['dyer\'s woad', 'dyers woad', 'isatis tinctoria'],
    displayName: 'Dyer\'s Woad',
    note: '\uD83D\uDFE1 Moderate fire risk \u2014 invasive. Brassica family biennial; common on disturbed slopes in southwest Montana. Dry stalks carry surface fire; treat before seed set.'
  },
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk — invasive',
    names: ['oxeye daisy', 'leucanthemum vulgare', 'chrysanthemum leucanthemum'],
    displayName: 'Oxeye Daisy',
    note: '\uD83D\uDFE1 Moderate fire risk \u2014 invasive. Spreads in pastures and roadsides; dry stems add fine fuel and reduce forage. Montana county-level noxious weed in many areas.'
  },
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk — invasive',
    names: ['st johnswort', 'st. johnswort', 'hypericum perforatum', 'common st. johnswort'],
    displayName: 'St. Johnswort',
    note: '\uD83D\uDFE1 Moderate fire risk \u2014 invasive. Oily compounds in foliage; forms dense patches on disturbed ground. Montana noxious weed; biocontrol available in many counties.'
  },
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk — invasive',
    names: ['scotch thistle', 'cotton thistle', 'onopordum acanthium'],
    displayName: 'Scotch Thistle',
    note: '\uD83D\uDFE1 Moderate fire risk \u2014 invasive. Large biennial; dry plants create substantial fine fuel. Montana priority noxious weed.'
  },
  {
    risk: 'high',
    riskLabel: 'High fire risk — invasive',
    names: ['absinth wormwood', 'artemisia absinthium'],
    displayName: 'Absinth Wormwood',
    note: '\uD83D\uDD34 High fire risk \u2014 invasive. Aromatic sage-family weed; volatile oils similar to sagebrush fuels. Montana listed noxious weed \u2014 treat before seed spread.'
  },

  // --- NATIVE GRASSES & GROUND COVER ---
  {
    risk: 'low',
    riskLabel: 'Lower fire risk',
    names: ['bluebunch wheatgrass', 'pseudoroegneria spicata', 'agropyron spicatum'],
    displayName: 'Bluebunch Wheatgrass',
    note: '\uD83D\uDFE2 Lower fire risk \u2014 native. Foundation grass of Montana sagebrush steppe and foothill rangeland. Maintains green growth longer than cheatgrass; restoring natives reduces invasive fire cycles.'
  },
  {
    risk: 'low',
    riskLabel: 'Lower fire risk',
    names: ['idaho fescue', 'festuca idahoensis'],
    displayName: 'Idaho Fescue',
    note: '\uD83D\uDFE2 Lower fire risk \u2014 native. Bunchgrass of cooler, moister sites; fine fuel when fully cured but generally lower continuity than invasive annual grasses. Good target species for reseeding after mitigation.'
  },
  {
    risk: 'low',
    riskLabel: 'Lower fire risk',
    names: ['prairie junegrass', 'koeleria macrantha', 'koeleria cristata'],
    displayName: 'Prairie Junegrass',
    note: '\uD83D\uDFE2 Lower fire risk \u2014 native. Early green-up bunchgrass; useful in low-fuel landscaping and restoration seed mixes on dry sites.'
  },
  {
    risk: 'low',
    riskLabel: 'Lower fire risk',
    names: ['needle and thread grass', 'hesperostipa comata', 'stipa comata'],
    displayName: 'Needle-and-thread Grass',
    note: '\uD83D\uDFE2 Lower fire risk \u2014 native. Common bunchgrass of plains and valleys; does not form continuous fine-fuel beds like cheatgrass. Supports healthy rangeland fire regimes.'
  },
  {
    risk: 'low',
    riskLabel: 'Lower fire risk',
    names: ['sandberg bluegrass', 'poa secunda'],
    displayName: 'Sandberg Bluegrass',
    note: '\uD83D\uDFE2 Lower fire risk \u2014 native. Small bunchgrass; low fuel volume. Common in understory and open forests.'
  },
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk',
    names: ['pinegrass', 'calamagrostis rubescens', 'feather reed grass'],
    displayName: 'Pinegrass',
    note: '\uD83D\uDFE1 Moderate fire risk. Native forest grass; builds thatch under conifers and can carry surface fire in dense stands. Rake litter near structures in forested zones.'
  },
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk',
    names: ['beargrass', 'xerophyllum tenax'],
    displayName: 'Beargrass',
    note: '\uD83D\uDFE1 Moderate fire risk. Native with resinous, waxy leaves; can torch under extreme conditions. Usually low concern unless dense patches border structures.'
  },
  {
    risk: 'low',
    riskLabel: 'Lower fire risk',
    names: ['kinnikinnick', 'arctostaphylos uva-ursi', 'bearberry'],
    displayName: 'Kinnikinnick',
    note: '\uD83D\uDFE2 Lower fire risk \u2014 native groundcover. Evergreen mat; lower flame length than tall shrubs. Acceptable in landscaped defensible space if kept moist and free of dead thatch against siding.'
  },
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk',
    names: ['common mullein', 'verbascum thapsus', 'mullein'],
    displayName: 'Common Mullein',
    note: '\uD83D\uDFE1 Moderate fire risk \u2014 biennial weed. Second-year dry stalks create tall fine-fuel torches. Easy to pull rosettes; mow or remove stalks before they dry near structures.'
  },
  {
    risk: 'low',
    riskLabel: 'Lower fire risk',
    names: ['yarrow', 'achillea millefolium'],
    displayName: 'Yarrow',
    note: '\uD83D\uDFE2 Lower fire risk. Native perennial forb; low fuel volume. Common in lawns and meadows \u2014 minor concern unless forming dense dry stands against structures.'
  },
  {
    risk: 'low',
    riskLabel: 'Lower fire risk',
    names: ['wild strawberry', 'fragaria virginiana', 'fragaria vesca'],
    displayName: 'Wild Strawberry',
    note: '\uD83D\uDFE2 Lower fire risk \u2014 native groundcover. Low-growing; acceptable near structures when irrigated or naturally moist.'
  },
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk',
    names: ['lupine', 'lupinus', 'lupinus argenteus', 'silvery lupine', 'large-leaved lupine', 'lupinus polyphyllus'],
    displayName: 'Lupine',
    note: '\uD83D\uDFE1 Moderate fire risk. Native and ornamental species; dry stalks add fine fuel. Nitrogen fixer that colonizes burns \u2014 manage density near structures.'
  },
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk',
    names: ['timothy', 'phleum pratense'],
    displayName: 'Timothy',
    note: '\uD83D\uDFE1 Moderate fire risk. Pasture grass; cured hay and seed heads carry surface fire along fencelines. Mow before full cure near buildings.'
  },
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk',
    names: ['orchard grass', 'dactylis glomerata'],
    displayName: 'Orchardgrass',
    note: '\uD83D\uDFE1 Moderate fire risk. Introduced pasture grass; dense cured stands add continuous fine fuel. Keep mowed within defensible space.'
  },

  // --- COMMON LANDSCAPE & GARDEN PLANTS ---
  {
    risk: 'very_high',
    riskLabel: 'Very high fire risk',
    names: ['arborvitae', 'thuja', 'thuja occidentalis', 'western redcedar', 'thuja plicata'],
    displayName: 'Arborvitae / Cedar',
    note: '\uD83D\uDD34 Very high fire risk. Popular hedge plant but extremely flammable \u2014 resinous foliage and tight spacing create a wall of fire. Replace with lower-fuel species within 30 feet of structures.'
  },
  {
    risk: 'very_high',
    riskLabel: 'Very high fire risk',
    names: ['cypress', 'cupressus', 'hinoki cypress', 'chamaecyparis'],
    displayName: 'Cypress',
    note: '\uD83D\uDD34 Very high fire risk. Ornamental conifer with volatile oils; never recommended in wildfire-prone zones. Remove from defensible space or maintain very wide spacing.'
  },
  {
    risk: 'high',
    riskLabel: 'High fire risk',
    names: ['colorado blue spruce', 'picea pungens', 'blue spruce', 'norway spruce', 'picea abies', 'spruce'],
    displayName: 'Spruce',
    note: '\uD83D\uDD34 High fire risk. Common landscape conifer; dense low branches and resinous needles. Planted spruces near homes are ladder-fuel hazards \u2014 limb up 10 feet and thin interiors.'
  },
  {
    risk: 'high',
    riskLabel: 'High fire risk',
    names: ['scotch pine', 'pinus sylvestris', 'austrian pine', 'pinus nigra', 'mugo pine', 'pinus mugo'],
    displayName: 'Ornamental Pine',
    note: '\uD83D\uDD34 High fire risk. Planted pines accumulate dead needles and low branches. Not native but common in yards; treat like wildland conifers within defensible space.'
  },
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk',
    names: ['lombardy poplar', 'populus nigra'],
    displayName: 'Lombardy Poplar',
    note: '\uD83D\uDFE1 Moderate fire risk. Planted windbreak tree; brittle wood and accumulating dead branches. Short-lived \u2014 assess hazard trees near structures.'
  },
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk',
    names: ['caragana', 'caragana arborescens', 'siberian peashrub'],
    displayName: 'Caragana',
    note: '\uD83D\uDFE1 Moderate fire risk \u2014 invasive in some areas. Dense shrub with fine twigs; old windbreak rows become serious fuel breaks gone wrong. Thin or remove aging rows near homes.'
  },
  {
    risk: 'high',
    riskLabel: 'High fire risk',
    names: ['scotch broom', 'cytisus scoparius', 'scotchbroom'],
    displayName: 'Scotch Broom',
    note: '\uD83D\uDD34 High fire risk \u2014 invasive. Oily stems ignite easily; seeds fire-stimulated. Montana noxious weed \u2014 remove and bag seed pods.'
  },
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk',
    names: ['lattice licorice-root', 'ligusticum', 'osha', 'ligusticum porteri'],
    displayName: 'Oshá / Lovage',
    note: '\uD83D\uDFE1 Moderate fire risk. Native medicinal forb of moist forests; tall dry stalks in fall. Low priority unless dense patches border structures.'
  },

  // --- RIPARIAN & WETLAND ---
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk',
    names: ['willow', 'salix', 'salix exigua', 'salix lucida', 'salix bebbiana', 'sandbar willow'],
    displayName: 'Willow',
    note: '\uD83D\uDFE1 Moderate fire risk. Riparian shrub or tree; high moisture when growing but dead stems and leaf litter accumulate. Clear dead material along creek-side structures.'
  },
  {
    risk: 'low',
    riskLabel: 'Lower fire risk',
    names: ['alders', 'alnus', 'alnus incana', 'alnus tenuifolia', 'thinleaf alder', 'speckled alder'],
    displayName: 'Alder',
    note: '\uD83D\uDFE2 Lower fire risk. Moist-site deciduous shrub or tree; generally less flammable than upland conifers when green. Manage deadwood near cabins in riparian zones.'
  },

  // --- AGRICULTURAL & RANGE ---
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk',
    names: ['alfalfa', 'medicago sativa'],
    displayName: 'Alfalfa',
    note: '\uD83D\uDFE1 Moderate fire risk. Hay fields and cured cuttings are serious ignition sources during harvest season. Maintain equipment fire safety and breaks between hay stacks and buildings.'
  },
  {
    risk: 'high',
    riskLabel: 'High fire risk',
    names: ['crested wheatgrass', 'agropyron cristatum', 'pseudoroegneria cristata'],
    displayName: 'Crested Wheatgrass',
    note: '\uD83D\uDD34 High fire risk when cured. Introduced range grass; forms continuous fine fuel across seeded pastures. Common in Montana \u2014 mow fire breaks along fencelines and structures.'
  },
  {
    risk: 'moderate',
    riskLabel: 'Moderate fire risk',
    names: ['sainfoin', 'onobrychis viciifolia'],
    displayName: 'Sainfoin',
    note: '\uD83D\uDFE1 Moderate fire risk. Deep-rooted forage; cured stands add surface fuel. Less aggressive than cheatgrass but manage along field edges near homes.'
  }
];
