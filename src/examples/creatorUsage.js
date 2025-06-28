// Example: Creator signup
import { signUp, getCurrentUser } from '../firebase/auth';
import { createOrUpdateCreatorProfile, getAllBrands, createCollaboration } from '../firebase/firestore';

// Creator signup example
const handleCreatorSignup = async (email, password, creatorName, niche) => {
  try {
    // Sign up with creator role
    const { user, role } = await signUp(email, password, 'creator', creatorName);
    
    // Create creator profile
    await createOrUpdateCreatorProfile(user.uid, {
      name: creatorName,
      niche: niche,
      bio: 'Creator bio',
      socials: {
        instagram: '@creatorname',
        youtube: '@creatorname',
        tiktok: '@creatorname'
      },
      categories: ['lifestyle', 'fashion'],
      location: 'New York, NY',
      followers: {
        instagram: 0,
        youtube: 0,
        tiktok: 0
      }
    });
    
    console.log('Creator account created successfully!');
  } catch (error) {
    console.error('Error creating creator account:', error);
  }
};

// Fetch brands for discovery
const fetchBrandsForDiscovery = async () => {
  try {
    const brands = await getAllBrands();
    console.log('Available brands for collaboration:', brands);
    return brands;
  } catch (error) {
    console.error('Error fetching brands:', error);
  }
};

// Create collaboration proposal
const createBrandCollaboration = async (brandId, proposal) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');
    
    const collaboration = await createCollaboration({
      brandId: brandId,
      creatorId: currentUser.uid,
      proposal: proposal,
      budget: proposal.budget,
      timeline: proposal.timeline,
      requirements: proposal.requirements
    });
    
    console.log('Collaboration proposal sent!', collaboration);
  } catch (error) {
    console.error('Error creating collaboration:', error);
  }
};

// Example usage in a React component
export const CreatorDashboard = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadBrands = async () => {
      setLoading(true);
      try {
        const availableBrands = await fetchBrandsForDiscovery();
        setBrands(availableBrands);
      } catch (error) {
        console.error('Failed to load brands:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBrands();
  }, []);

  const handleCollaborationRequest = async (brandId) => {
    const proposal = {
      budget: 1000,
      timeline: '2 weeks',
      requirements: 'Create 3 Instagram posts and 1 YouTube video'
    };

    await createBrandCollaboration(brandId, proposal);
  };

  return (
    <div>
      <h1>Creator Dashboard</h1>
      {loading ? (
        <p>Loading brands...</p>
      ) : (
        <div>
          <h2>Available Brands</h2>
          {brands.map(brand => (
            <div key={brand.id}>
              <h3>{brand.name}</h3>
              <p>{brand.description}</p>
              <button onClick={() => handleCollaborationRequest(brand.id)}>
                Send Collaboration Request
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 