arch
	[projectId]
		name: [string]
		student: [userId]
		advisor: [userId]
		contract
			signedByStudent: [boolean]
			signedByAdvisor: [boolean]
		preProposal
			document: [fileId]
			approvedByAdvisor: [boolean]
			approvedByDean: [boolean]
		researchPlan
			document: [fileId]
			approvedByAdvisor: [boolean]
			approvedByDean: [boolean]
		abstract
			document: [fileId]
			approvedByAdvisor: [boolean]
			approvedByDean: [boolean]
		poster
			document: [fileId]
			approvedByAdvisor: [boolean]
			approvedByDean: [boolean]
		thesis
			document: [fileId]
			approvedByAdvisor: [boolean]
			approvedByDean: [boolean]

users
	pid [string]
	profile
		fname: [string]
		lname: [string]
		bio: [string]
		photo
			x36: [fileId]
			x48: [fileId]
			x128: [fileId]
	interests
		[tagId]: true
	archProjects
		[projectId]: true
	rsvps
		[eventId]: true
	swipes
		[eventId]: true
	comments
		[commentId]: true
	files
		[fileId]: true
	portfolio
		submitted
			by: [userId]
			date: [int]
			comment: [string]
		entries
			[entryId]
				assignment: [fileId]
				reflection: [fileId]
		/* STILL NEED TO FIND OUT ABOUT
		FACULTY EVALUTATIONS FROM JOSE */

files
	[fileId]
		owner: [userId]
		filename: [string]
		public: [boolean]

comments
	[commentId]
		author: [userId]
		content: [string]
		date: [int]
		parent: [commentId]
		children:
			[commentId]: true
		upvotes
			[userId]: true
		tags
			[tagId]: true

events
	[eventId]
		info
			name: [string]
			desc: [string]
			type: [string]
			date
				begins: [int]
				ends: [int]
			location
				name: [string]
				lat: [float]
				lng: [float]
		comments
			[commentId]: true
		rsvps
			[userId]: true
		swipes
			[userId]
				in: [int]
				out: [int]
				override: [boolean]

courses
	[courseId]
		info
			name: [string]
			subtitle: [string]
			desc: [string]
			syllabus: [fileId]
		members
			[userId]: true
		announcements
			[announceId]
				title: [string]
				content: [string]
				authorId: [userId]
				date: [int]
				color: [string]


system_settings
	accessLevels
		isArchMod
			[userId]: true
		isAdmin
			[userId]: true