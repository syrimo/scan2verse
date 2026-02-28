import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Search, Filter, Heart, MessageCircle, Share2, Clock, Utensils } from 'lucide-react';
import { format } from 'date-fns';

interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving_size: string;
  category?: string;
  image_url?: string;
  is_packaged?: boolean;
  barcode?: string;
  ingredients?: string;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  cholesterol?: number;
  created_at: string;
}

interface FoodEntry {
  id: string;
  food_id: string;
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  quantity: number;
  notes?: string;
  created_at: string;
  food?: Food;
}

interface FoodGalleryProps {
  foodEntries: FoodEntry[];
  loading?: boolean;
}

const FoodGallery = ({ foodEntries, loading }: FoodGalleryProps) => {
  const [selectedEntry, setSelectedEntry] = useState<FoodEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [mealFilter, setMealFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');

  // Filter and sort entries
  const filteredEntries = foodEntries
    .filter(entry => {
      if (!entry.food) return false;
      
      const matchesSearch = entry.food.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMeal = mealFilter === 'all' || entry.meal_type === mealFilter;
      const hasImage = entry.food.image_url && entry.food.image_url !== '';
      
      return matchesSearch && matchesMeal && hasImage;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'calories':
          return (b.food?.calories || 0) - (a.food?.calories || 0);
        case 'name':
          return (a.food?.name || '').localeCompare(b.food?.name || '');
        default:
          return 0;
      }
    });

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      case 'snack': return '🍎';
      default: return '🍽️';
    }
  };

  const getMealColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'lunch': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'dinner': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'snack': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getImageUrl = (food: Food) => {
    if (food.image_url && food.image_url !== '' && food.image_url !== 'null') {
      return food.image_url;
    }
    // Fallback to Unsplash food image
    return `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop&crop=center`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="h-10 bg-white/10 rounded-lg animate-pulse flex-1"></div>
          <div className="h-10 bg-white/10 rounded-lg w-32 animate-pulse"></div>
          <div className="h-10 bg-white/10 rounded-lg w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square bg-white/10 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
          <Input
            placeholder="Search your foods..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>
        
        <Select value={mealFilter} onValueChange={setMealFilter}>
          <SelectTrigger className="w-full sm:w-32 bg-white/10 border-white/20 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-white/20">
            <SelectItem value="all">All Meals</SelectItem>
            <SelectItem value="breakfast">Breakfast</SelectItem>
            <SelectItem value="lunch">Lunch</SelectItem>
            <SelectItem value="dinner">Dinner</SelectItem>
            <SelectItem value="snack">Snacks</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-32 bg-white/10 border-white/20 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-white/20">
            <SelectItem value="recent">Recent</SelectItem>
            <SelectItem value="calories">Calories</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-4 text-sm text-white/70 mb-6">
        <span>{filteredEntries.length} photos</span>
        <span>•</span>
        <span>{foodEntries.filter(e => e.food?.image_url).length} total food images</span>
        <span>•</span>
        <span>{new Set(foodEntries.map(e => e.food?.name)).size} unique foods</span>
      </div>

      {/* Gallery Grid */}
      {filteredEntries.length === 0 ? (
        <div className="text-center py-12">
          <Utensils className="w-12 h-12 text-white/30 mx-auto mb-4" />
          <p className="text-white/50 text-lg mb-2">No food photos found</p>
          <p className="text-white/30">Start scanning food with your mobile app to see your gallery!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
              onClick={() => setSelectedEntry(entry)}
            >
              <img
                src={getImageUrl(entry.food!)}
                alt={entry.food!.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300">
                <div className="absolute inset-0 p-3 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {/* Top badges */}
                  <div className="flex justify-between items-start">
                    <Badge className={`text-xs ${getMealColor(entry.meal_type)}`}>
                      {getMealIcon(entry.meal_type)} {entry.meal_type}
                    </Badge>
                    <div className="text-white text-xs font-semibold bg-black/50 px-2 py-1 rounded">
                      {entry.food!.calories} cal
                    </div>
                  </div>
                  
                  {/* Bottom info */}
                  <div className="text-white">
                    <p className="font-semibold text-sm truncate">{entry.food!.name}</p>
                    <p className="text-xs text-white/80">
                      {format(new Date(entry.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Corner indicators */}
              {entry.food!.is_packaged && (
                <div className="absolute top-2 left-2 w-2 h-2 bg-blue-400 rounded-full"></div>
              )}
              {entry.quantity > 1 && (
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                  {entry.quantity}x
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Food Detail Modal */}
      <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
        <DialogContent className="max-w-2xl bg-gray-900 border-white/20 text-white">
          {selectedEntry && selectedEntry.food && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-white">
                  {selectedEntry.food.name}
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Image */}
                <div className="space-y-4">
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <img
                      src={getImageUrl(selectedEntry.food)}
                      alt={selectedEntry.food.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Social actions (future community features) */}
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                      <Button variant="ghost" size="sm" className="text-white/70 hover:text-red-400">
                        <Heart className="w-4 h-4 mr-2" />
                        Like
                      </Button>
                      <Button variant="ghost" size="sm" className="text-white/70 hover:text-blue-400">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Comment
                      </Button>
                      <Button variant="ghost" size="sm" className="text-white/70 hover:text-green-400">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  {/* Meal info */}
                  <div className="flex items-center gap-3">
                    <Badge className={getMealColor(selectedEntry.meal_type)}>
                      {getMealIcon(selectedEntry.meal_type)} {selectedEntry.meal_type}
                    </Badge>
                    <div className="flex items-center text-white/70 text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {format(new Date(selectedEntry.created_at), 'MMM d, yyyy • h:mm a')}
                    </div>
                  </div>

                  {/* Nutrition */}
                  <div className="bg-white/5 rounded-lg p-4 space-y-3">
                    <h4 className="font-semibold text-cyan-300">Nutrition Facts</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/70">Calories:</span>
                        <span className="font-semibold text-orange-400">
                          {Math.round(selectedEntry.food.calories * selectedEntry.quantity)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Protein:</span>
                        <span className="font-semibold text-green-400">
                          {Math.round(selectedEntry.food.protein * selectedEntry.quantity)}g
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Carbs:</span>
                        <span className="font-semibold text-blue-400">
                          {Math.round(selectedEntry.food.carbs * selectedEntry.quantity)}g
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Fat:</span>
                        <span className="font-semibold text-purple-400">
                          {Math.round(selectedEntry.food.fat * selectedEntry.quantity)}g
                        </span>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-white/10">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Serving:</span>
                        <span>{selectedEntry.food.serving_size}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Quantity:</span>
                        <span>{selectedEntry.quantity}x</span>
                      </div>
                    </div>
                  </div>

                  {/* Additional info */}
                  {selectedEntry.food.ingredients && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <h4 className="font-semibold text-cyan-300 mb-2">Ingredients</h4>
                      <p className="text-sm text-white/70">{selectedEntry.food.ingredients}</p>
                    </div>
                  )}

                  {selectedEntry.notes && (
                    <div className="bg-white/5 rounded-lg p-4">
                      <h4 className="font-semibold text-cyan-300 mb-2">Notes</h4>
                      <p className="text-sm text-white/70">{selectedEntry.notes}</p>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {selectedEntry.food.category && (
                      <Badge variant="outline" className="text-white/70 border-white/30">
                        {selectedEntry.food.category}
                      </Badge>
                    )}
                    {selectedEntry.food.is_packaged && (
                      <Badge variant="outline" className="text-blue-400 border-blue-400/30">
                        Packaged
                      </Badge>
                    )}
                    {selectedEntry.food.barcode && (
                      <Badge variant="outline" className="text-green-400 border-green-400/30">
                        Scanned
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FoodGallery;
