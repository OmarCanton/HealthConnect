import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { sampleArticles } from '../../data/educationTips';
import { color } from '../../data/color';

export default function Education() {
    const [articles, setArticles] = useState([]);
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Mental Health', 'Heart Health', 'Nutrition', 'Fitness', 'General Health'];

    useEffect(() => {
        setArticles(sampleArticles);
        setFilteredArticles(sampleArticles);
        setLoading(false);
    }, []);

    useEffect(() => {
        // Filter articles based on search query and category
        let filtered = articles;
        
        if (searchQuery) {
        filtered = filtered.filter(article => 
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        }
        
        if (selectedCategory !== 'All') {
        filtered = filtered.filter(article => article.category === selectedCategory);
        }
        
        setFilteredArticles(filtered);
    }, [searchQuery, selectedCategory, articles]);

    const RenderArticle = ({ item }) => (
        <TouchableOpacity style={styles.articleCard}>
            <View style={styles.articleHeader}>
                <Text style={styles.articleTitle}>{item.title}</Text>
                <Text style={styles.articleCategory}>{item.category}</Text>
            </View>
            
            <Text style={styles.articleExcerpt} numberOfLines={3}>
                {item.content}
            </Text>
            
            <View style={styles.articleFooter}>
                <Text style={styles.articleAuthor}>By {item.author}</Text>
                <Text style={styles.articleReadTime}>{item.readTime} read</Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
        <View style={styles.container}>
            <Text>Loading articles...</Text>
        </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.title}>Health Education</Text>
        </View>
        
        <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
                style={styles.searchInput}
                placeholder="Search articles..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
        </View>
        
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoryContainer}
            contentContainerStyle={styles.categoryContent}
        >
            {categories.map((category) => (
            <TouchableOpacity
                key={category}
                style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.selectedCategoryButton
                ]}
                onPress={() => setSelectedCategory(category)}
            >
                <Text 
                    style={[
                        styles.categoryText,
                        selectedCategory === category && styles.selectedCategoryText
                    ]}
                >
                {category}
                </Text>
            </TouchableOpacity>
            ))}
        </ScrollView>
        
        <ScrollView style={styles.articlesList}>
            {filteredArticles.length > 0 ? (
                filteredArticles.map((item, index) => <RenderArticle key={index} item={ item } />)
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No articles found</Text>
                </View>
            )}
        </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 20,
        backgroundColor: color,
    },
    title: {
        paddingTop: 10,
        fontSize: 25,
        fontWeight: 'bold',
        color: '#fff',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginTop: 20,
        marginHorizontal: 20,
        borderRadius: 10,
        paddingHorizontal: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderColor: color,
        borderWidth: 1
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 15,
        fontSize: 16,
    },
    categoryContainer: {
        maxHeight: 60,
        marginHorizontal: 20,
    },
    categoryContent: {
        alignItems: 'center',
    },
    categoryButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#e0e0e0',
        marginRight: 10,
    },
    selectedCategoryButton: {
        backgroundColor: color,
    },
    categoryText: {
        fontSize: 14,
        color: '#333',
    },
    selectedCategoryText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    articlesList: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 5,
    },
    articleCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        // elevation: 3,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 4,
        borderColor: color,
        borderWidth: 1.3,
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
        borderTopRightRadius: 25,
        borderBottomRightRadius: 10,
    },
    articleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    articleTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
    },
    articleCategory: {
        fontSize: 12,
        color: 'white',
        backgroundColor: '#34c759ff',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        marginLeft: 10,
    },
    articleExcerpt: {
        fontSize: 14,
        color: '#666',
        marginBottom: 15,
    },
    articleFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    articleAuthor: {
        fontSize: 12,
        color: '#999',
    },
    articleReadTime: {
        fontSize: 12,
        color: '#999',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
});